import './App.css';
import React, { Component } from 'react';
import MyNFT from './contracts/MyNFT.json'
import Web3 from 'web3';

class isMyNFT extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addressMarketPlace: '0x0',
      myNFT: {},
      myNFTBalance: '0',
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
  }
  async mintNFT(tokenID, URI) {
    if (this.state.myNFT !== 'undefined') {
      try {
        await this.state.myNFT.methods.mintToken(tokenID, URI).send({ from: this.state.account })
        console.log('Done')
      } catch (e) {
        console.log('Error, mintNFT: ', e)
      }
    }
  }

  render() {
    return (
      <div id="wrapper">
      <div id="page-" className="gray-bg"> 
      <div className="row wrapper border-bottom white-bg page-heading"style={{padding:'0',marginLeft:'10px'}}>
              <div className="col-lg-10" style ={{paddingBottom:'10px'}}>
                <h2>NFT</h2>
              </div>
              
        </div>
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            <div className="col-lg-9">
              <div className="ibox ">
                <div className="ibox-content">
                  <div className="row">
                    <div className="col-sm-8 b-r"><h3 className="m-t-none m-b">Mint NFT</h3>
                      <p>Sign in today for more expirience.</p>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            let idToken = this.mintTokenID.value
                            let uri = this.mintTokenURI.value
                            this.mintNFT(idToken, uri)
                          }}>
                            <div className='form-group mr-sm-2'>
                              <br></br>
                              <input
                                id='mintTokenID'
                                type='number'
                                ref={(input) => { this.mintTokenID = input }}
                                className="form-control form-control-md"
                                placeholder='ID NFT'
                                required />
                              <br></br>
                              <input
                                id='mintTokenURI'
                                ref={(input) => { this.mintTokenURI = input }}
                                className="form-control form-control-md"
                                placeholder='URI'
                                required />
                          </div>
                          <button className="btn btn-sm btn-primary float-right m-t-n-xs" type="submit"><strong>Mint</strong></button>
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
      </div>
    </div>
    
    );
  }
}

export default isMyNFT;