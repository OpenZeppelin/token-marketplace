import React from 'react'
import Store from '../../store'
import TokenSaleActions from '../../actions/tokensales'

export default class TokenSaleFulfill extends React.Component {
  constructor(props){
    super(props)
    this.state = { account: this.props.account, tokenSale: this.props.tokenSale }
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ account: nextProps.account, tokenSale: nextProps.tokenSale })
  }

  render() {
    return (
      <div ref="tokenSaleFulfill" className={"col " + this.props.col}>
        <form className="card" onSubmit={this._handleSubmit}>
          <div className="card-content">
            <h3 className="title">Fulfill contract</h3>
            <div className="row">{this._buildFulfillDescription()}</div>
          </div>
          <div className="card-action">
            <button disabled={this._notEnoughEther()} className="btn btn-primary">Fulfill</button>
          </div>
        </form>
      </div>
    );
  }

  _buildFulfillDescription() {
    const account = this.state.account;
    return this._notEnoughEther() ?
      <div className="col s12">
        <p>You don't have enough ether balance in your account ({account.address}) to fulfill this contract.</p>
      </div> :
      <div className="col s12">
        <p><b>If you fulfill this token sale contract, then one transaction will be performed:</b></p>
        <p>You will be requested to sign an ether transaction from your account ({account.address}) to the token sale contract, in order to receive the given amount of tokens in return.</p>
      </div>
  }

  _notEnoughEther() {
    const account = this.state.account || {};
    const tokenSale = this.state.tokenSale || {};
    if(!account.etherBalance || !tokenSale.price) return false;
    return account.etherBalance.lessThan(tokenSale.price)
  }

  _handleSubmit(e) {
    e.preventDefault();
    Store.dispatch(TokenSaleActions.fulfill(this.state.tokenSale.address, this.state.account.address))
  }
}
