import './App.css';
import React, { Component } from 'react';
import MyNFT from './contracts/MyNFT.json'
import Web3 from 'web3';
import { Route, Link } from "react-router-dom";
import NavBar from "./NavBar";
import TokenERC20 from "./TokenERC20";
import Martket from "./Market";
import isMyNFT from './MyNFT';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      addressMarketPlace: '0x0',
      myNFT: {},
      myNFTBalance: '0',
      systemInfo: [],
      erc20TokenBalance:'0',
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
  render() {
    return (
      <div id="wrapper">
        <nav className="navbar-default navbar-static-side" role="navigation">
          <div className="sidebar-collapse">
            <ul className="nav metismenu" id="side-menu">
              <li className="nav-header">
                <div style={{textAlign:'center',color:'white'}} className="dropdown profile-element">
                  <img alt="image" className="rounded-circle" src="img/profile_small.jpg" />
                    <h4 className="block m-t-xs font-bold">David Williams</h4>
                    <h4>{this.state.myNFTBalance} NFT </h4>
                    <h4>{(this.state.erc20TokenBalance)} EC</h4> 
                </div>
                <div className="logo-element">
                  IN+
              </div>
              </li>
            </ul>
            <NavBar />
          </div>
        </nav>
        <div id="page-wrapper" className="gray-bg">
          <div className="row border-bottom"> 
          <nav className="navbar navbar-static-top" role="navigation" style={{marginBottom: 0}}>
            <div className="navbar-header" style={{marginLeft:'20px'}}>
              <h2 style={{fontWeight:'800'}}>NFT Market</h2>              
            </div>
            <ul className="nav navbar-top-links navbar-right" style={{backgroundColor:'#f3f3f4'}}>
              <li>
                <span className="m-r-sm text-muted welcome-message">{this.state.account}</span>
              </li>
            </ul>
          </nav>
            <Route exact path="/myNFT" component={isMyNFT} />
            <Route exact path="/tokenerc20" component={TokenERC20} />
            <Route exact path="/market" component={Martket} />
          </div>
        </div>

      </div>
    );
  }
}

export default App;