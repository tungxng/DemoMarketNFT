import './App.css';
import React, { Component } from 'react';
import ERC20Token from './contracts/TokenFactory.json'
import Web3 from 'web3';

class TokenERC20 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      addressMarketPlace: '0x0',
      erc20Token: {},
      balance: '0',
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

          <div className="row wrapper border-bottom white-bg page-heading" style={{ padding: '0', marginLeft: '10px' }}>
            <div className="col-lg-10" style={{ paddingBottom: '10px' }}>
              <h2>ERC20</h2>
            </div>

          </div>
          <div className="wrapper wrapper-content animated fadeInRight">
            <div className="row">
              <div className="col-lg-7">
                <div className="ibox ">
                  <div className="ibox-content">
                    <div className="row">
                      <div className="col-sm-12 b-r"><h3 className="m-t-none m-b">Buy ERC20</h3>
                        <form onSubmit={(e) => {
                          e.preventDefault()
                          let amount = this.BuyAmount.value
                          amount = window.web3.utils.toWei(amount)
                          this.buyE20(amount)
                        }}>
                          <div className='form-group mr-sm-2'>
                            <br></br>
                            <input
                              id='depositAmount'
                              step="0.01"
                              type='number'
                              ref={(input) => { this.BuyAmount = input }}
                              className="form-control form-control-md"
                              placeholder='Ether'
                              required />
                          </div>
                          <button className="btn btn-sm btn-primary float-right m-t-n-xs" type="submit"><strong>Buy</strong></button>
                        </form>
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


export default TokenERC20;