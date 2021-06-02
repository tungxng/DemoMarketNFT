import './App.css';
import './Market.css';
import React, { Component } from 'react';
import MyNFT from './contracts/MyNFT.json'
import ERC20Token from './contracts/TokenFactory.json'
import MarketPlace from './contracts/Marketplace.json'
import Web3 from 'web3';

class Market extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      addressMarketPlace: '0x0',
      myNFT: {},
      erc20Token: {},
      marketPlace: {},
      balance: '0',
      myNFTBalance: '0',
      erc20TokenBalance: '0',
      systemInfo: [],
      loading: true,
    }
  }
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  async getItem() {
    // let uri = await this.state.myNFT.methods.tokenURI(tokenID).call({from: this.state.account});
    var getJSON = function (url, callback) {

      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'json';

      xhr.onload = function () {

        var status = xhr.status;

        if (status === 200) {
          callback(null, xhr.response);
        } else {
          callback(status);
        }
      };

      xhr.send();
    };

    getJSON("https://gateway.pinata.cloud/ipfs/QmeChCkzeLmwdWWe5tDhiCnBe5V64RU1AB1Tw8AK8zwCWh", function (err, data) {
      if (err != null) {
        console.error(err);
      } else {
        var description = `${data.description}`
        var name = `${data.name}`
        var image = `${data.image}`
        console.log(description, name, image)
        return description, name, image
      }
    })
  }
  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    //load balance
    if (typeof accounts[0] !== 'undefined') {
      const balance = await web3.eth.getBalance(accounts[0])
      this.setState({ account: accounts[0], balance: balance })
    } else {
      window.alert('Please login with MetaMask')
    }
    // Load MyNFT
    const myNFTData = MyNFT.networks[networkId]
    if (myNFTData) {
      const myNFT = new web3.eth.Contract(MyNFT.abi, myNFTData.address)
      this.setState({ myNFT: myNFT })
      let myNFTBalance = await myNFT.methods.balanceOf(this.state.account).call()
      this.setState({ myNFTBalance: myNFTBalance.toString() })
    } else {
      window.alert('MyNFT contract not deployed to detected network.')
    }
    this.setState({ loading: false })
    // Load ERCToken
    const ERC20TokenData = ERC20Token.networks[networkId]
    if (ERC20TokenData) {
      const erc20Token = new web3.eth.Contract(ERC20Token.abi, ERC20TokenData.address)
      this.setState({ erc20Token: erc20Token })
      let erc20TokenBalance = await erc20Token.methods.balanceOf(this.state.account).call()
      let systemInfo = await erc20Token.methods.systemInfo().call()
      this.setState({ erc20TokenBalance: erc20TokenBalance.toString(), systemInfo: systemInfo })
    } else {
      window.alert('ERC20Token contract not deployed to detected network.')
    }
    // Load Market
    const MarketPlaceData = MarketPlace.networks[networkId]
    if (MarketPlaceData) {
      const marketPlace = new web3.eth.Contract(MarketPlace.abi, MarketPlaceData.address)
      const addressMarketPlace = MarketPlaceData.address;
      this.setState({ marketPlace, addressMarketPlace: addressMarketPlace })
    } else {
      window.alert('MarketPlace contract not deployed to detected network.')
    }
  }

  async sellNFT(tokenID, price) {
    if (this.state.myNFT !== 'undefined' && this.state.marketPlace !== 'undefined') {
      try {
        await this.state.myNFT.methods.approve(this.state.addressMarketPlace, tokenID).send({ from: this.state.account })
        await this.state.marketPlace.methods.saleNFT(tokenID, price).send({ from: this.state.account })
        console.log('Done')
      } catch (e) {
        console.log('Error, sellNFT: ', e)
      }
    }
  }

  async buyNFT(tokenID) {
    if (this.state.erc20Token !== 'undefined' && this.state.marketPlace !== 'undefined') {
      try {
        let getTokenInfo = await this.state.marketPlace.methods.getTokenInfo(tokenID).call()
        let price = getTokenInfo[1]
        await this.state.erc20Token.methods.approve(this.state.addressMarketPlace, price.toString()).send({ from: this.state.account })
        await this.state.marketPlace.methods.buyToken(tokenID).send({ from: this.state.account })
        console.log(price)
        console.log('Done')
      } catch (e) {
        console.log('Error, buyNFT: ', e)
      }
    }
  }
  async buyE20(amount) {
    if (this.state.erc20Token !== 'undefined') {
      try {
        await this.state.erc20Token.methods.buyToken().send({ value: amount, from: this.state.account })
        console.log('Done')
      } catch (e) {
        console.log('Error, buyE20: ', e)
      }
    }
  }
  render() {
    return (
      <div id="wrapper">
        <div id="page-" className="gray-bg">
        <div className="row wrapper border-bottom white-bg page-heading"style={{padding:'0',marginLeft:'10px'}}>
          <div className="col-lg-10" style ={{paddingBottom:'10px'}}>
            <h2>MarKet</h2>
          </div>
        </div>
          <div className="wrapper wrapper-content animated fadeInRight">
            <div className="row">
              <div className="col-lg-12">
                <div className="ibox ">
                  <div className="ibox-content">
                    <div className="row">
                      
                      <div className="col-sm-4 b-r"><h3 className="m-t-none m-b">Sale</h3>
                        <p>Sign in today for more expirience.</p>
                        <form onSubmit={(e) => {
                          e.preventDefault()
                          let idToken = this.sellNFTID.value
                          let price = window.web3.utils.toWei(this.sellNFTPrice.value)
                          this.sellNFT(idToken, price)
                        }}>
                          <div className='form-group mr-sm-2'>
                            <br></br>
                            <input
                              id='sellNFTID'
                              type='number'
                              ref={(input) => { this.sellNFTID = input }}
                              className="form-control form-control-md"
                              placeholder='ID NFT'
                              required />
                            <br></br>
                            <input
                              id='sellNFTPrice'
                              ref={(input) => { this.sellNFTPrice = input }}
                              className="form-control form-control-md"
                              placeholder='Price'
                              required />
                          </div>
                          <button className="btn btn-sm btn-primary float-right m-t-n-xs" type="submit" style={{marginRight:'10px'}}><strong>Sale</strong></button>
                        </form>
                      </div>
                      
                      <div className="col-sm-4 b-r"><h3 className="m-t-none m-b">Buy</h3>
                        <p>Sign in today for more expirience.</p>

                        <form onSubmit={(e) => {
                          e.preventDefault()
                          let idNFT = this.BuyNFTID.value
                          this.buyNFT(idNFT)
                        }}>
                          <div className='form-group mr-sm-2'>
                            <br></br>
                            <input
                              id='depositAmount'
                              type='number'
                              ref={(input) => { this.BuyNFTID = input }}
                              className="form-control form-control-md"
                              placeholder='ID NFT'
                              required />
                          </div>
                          <button className="btn btn-sm btn-primary float-right m-t-n-xs" type="submit"style={{marginRight:'10px'}}><strong>Buy</strong></button>
                        </form>
                      </div>
                      <div className="col-sm-4 b-r"><h3 className="m-t-none m-b">Get NFT</h3>
                        <p>Sign in today for more expirience.</p>

                        <div className="form-group"><label>ID NFT</label> <input type="number" placeholder="ID" className="form-control" /></div>

                        <div>
                          <button className="btn btn-sm btn-primary float-right m-t-n-xs" type="submit"><strong>Get</strong></button>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
          <div className="wrapper wrapper-content animated fadeInRight">
  <div className="row">
    <div className="col-lg-3">
      <div className="contact-box center-version">
        <a href="#">
          <img alt="image" className="rounded-circle" src="img/a2.jpg" />
          <h3 className="m-b-xs"><strong>NAME</strong></h3>
          <div className="font-bold">NFT</div>
          <address className="m-t-md">
            <strong>Price: 50 ERC</strong><br />
            description<br />
          </address>
        </a>
        <div className="contact-box-footer">
          <div className="m-t-xs btn-group">
            <a href className="btn btn-sm btn-primary float-right m-t-n-xs">BUY NFT</a>
          </div>
        </div>
      </div>
    </div>
    <div className="col-lg-3">
      <div className="contact-box center-version">
        <a href="#">
          <img alt="image" className="rounded-circle" src="img/a1.jpg" />
          <h3 className="m-b-xs"><strong>NAME</strong></h3>
          <div className="font-bold">NFT</div>
          <address className="m-t-md">
            <strong>Price: 10 ERC</strong><br />
            description<br />
          </address>
        </a>
        <div className="contact-box-footer">
          <div className="m-t-xs btn-group">
            <a href className="btn btn-sm btn-primary float-right m-t-n-xs">BUY NFT</a>
          </div>
        </div>
      </div>
    </div>
    <div className="col-lg-3">
      <div className="contact-box center-version">
        <a href="#">
          <img alt="image" className="rounded-circle" src="img/a3.jpg" />
          <h3 className="m-b-xs"><strong>Name</strong></h3>
          <div className="font-bold">NFT</div>
          <address className="m-t-md">
            <strong>Price: 30 ERC</strong><br />
            description<br />
          </address>
        </a>
        <div className="contact-box-footer">
          <div className="m-t-xs btn-group">
            <a href className="btn btn-sm btn-primary float-right m-t-n-xs">BUY NFT</a>
          </div>
        </div>
      </div>
    </div>
    <div className="col-lg-3">
      <div className="contact-box center-version">
        <a href="#">
          <img alt="image" className="rounded-circle" src="img/a4.jpg" />
          <h3 className="m-b-xs"><strong>NAME</strong></h3>
          <div className="font-bold">NFT</div>
          <address className="m-t-md">
            <strong>Price: 20 ERC</strong><br />
            description<br />
          </address>
        </a>
        <div className="contact-box-footer">
          <div className="m-t-xs btn-group">
            <a href className="btn btn-sm btn-primary float-right m-t-n-xs">BUY NFT</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

          </div>


        </div>
      </div>

    );
  }
}

export default Market;