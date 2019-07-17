import React, { Component } from 'react';
import '../styles/App.css';

class Product extends Component {
    render() {
        return (
            <div>
                <img src={this.props.image}></img>
                <div>
                    {this.props.title}
                    - ${this.props.price.amount} {this.props.price.currencyCode}
                </div>
            </div>
            
        )
    
    }
}

export default Product