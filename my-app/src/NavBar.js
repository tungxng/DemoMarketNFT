import './App.css';
import './Market.css';
import React, { Component } from 'react';
import { Link } from "react-router-dom";

class NavBar extends Component {
    render() {
        return (     
            <div >
                <div style={{fontSize:'18px',fontWeight:'700'}}>     
                    <ul>
                        <li><Link to="/myNFT">Mint NFT</Link></li>
                        <li><Link to="/tokenerc20">Buy ERC20</Link></li>
                        <li> <Link to="/market">Martket</Link></li>

                    </ul>
                </div>
            </div>
        );
    }
}
export default NavBar;