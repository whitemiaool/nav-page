import React, { Component } from 'react';
import Weather from './component/weather';
import google from './google2.png'
import baidu from './baidu.png'

class App extends Component {
	constructor() {
		super();
		this.state = {
			search:0,
			scontent:''
		}
	}
	changeSearch = ()=>{
		this.setState({
			search:this.state.search+1
		})
	}
	handleKeyDown = (e)=>{
		if(e.keyCode === 13) {
			this.gotoSearch()
		}
	}
	gotoSearch = ()=>{
		if(this.state.search%2===0) {
			this.googleSearch();
			return
		}
		this.baiduSearch();
	}
	baiduSearch = ()=>{
		window.open(`//www.baidu.com/s?wd=${this.state.scontent}&t=${Date.now()}`);
	}
	googleSearch = ()=>{
		window.open(`//www.google.com.hk/search?q=${this.state.scontent}&t=${Date.now()}`);		
	}
	inputChange =(e)=>{
		this.setState({
			scontent:e.target.value
		})
	}
	componentDidMount() {
		document.addEventListener('keydown',this.handleKeyDown);
		this.ipt.focus()
	}
	
	render() {
		let {search,scontent} = this.state;
		let logStyle = {
			transform:`translateX(-50%) rotateY(${search*180}deg)`
		}
		return (
			<div className="App">
				<div onClick={this.changeSearch} className="app_log-wrap">
					<div style={logStyle} className="app_log-log">
						<img src={google} alt=""/>
						<img src={baidu} alt=""/>
					</div>
				</div>
				{/* <div className={search%2==0?"app_footer app_back-g":"app_footer app_back-b"}> */}
				<div >
					<div className="app_input_wrap">
						<div className="app_input-input">
							<input ref={(ref)=>this.ipt = ref} value={scontent} onChange={this.inputChange} className="app_input" type="text"/>
							<i onClick={this.gotoSearch} className="app_log-change"></i>
						</div>
					</div>
					<div className="app-person">
						{/* <div className="wea-wrap"></div> */}
						<Weather></Weather>
						<Weather></Weather>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
