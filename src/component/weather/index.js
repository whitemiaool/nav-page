import React,{Component} from 'react';
import axios from 'axios'
import API from '../../api'
import './os.css'
const bgc = ['linear-gradient(#0056ff,#79bfff)',
'linear-gradient(#000000,#585858)',
'linear-gradient(#0056ff,#79bfff)',
'linear-gradient(#000000,#585858)',
'linear-gradient(#dadada,#6f6c46)',
'linear-gradient(#ffeb8a,#8a8181)',
'linear-gradient(#a9a9a9,#000000)',
'linear-gradient(#ffeb8a,#8a8181)',
'linear-gradient(#a9a9a9,#000000)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#383838,#585858)',
'linear-gradient(#0056ff,#79bfff)',
]
export default class Weather extends Component {
    constructor() {
        super()
        this.state = {
            data:null
        }
    }
    async componentWillMount() {
        let res = await axios.get(API.getWeather);
        let resdata = {};
        try {
            res = res.data
            resdata.loc = res.data.res.results[0].location.name;
            resdata.tep = res.data.res.results[0].now.temperature;
            resdata.text = res.data.res.results[0].now.text;
            resdata.img = res.data.res.results[0].now.code;
            resdata.curupdate = res.data.res.results[0].last_update.match(/T(.{5})/)[1];

            resdata.day1 = res.data.postres.results[0].daily[0];
            resdata.day2 = res.data.postres.results[0].daily[1];
            resdata.day3 = res.data.postres.results[0].daily[2];

            resdata.wd = resdata.day1.wind_direction;
            resdata.ws = resdata.day1.wind_scale;
        } catch(e) {
            console.log(e);
            console.log('获取天气数据错误')
        }
        this.setState({
            data:resdata
        })
    }
    render() {
        let {data} = this.state;
        let bg = bgc[data&&data.img]
        return (
            <div className="wea-wrap" style={{background:bg}}>
{           data &&<div>
            <div >
                <div className="container_34tvPM- flexContainer_1FmVJep textLeft_3snekzo" >
                    <div className="wea-whe" >
                        <div className="wea-city" >{data.loc}</div>
                        <div className="wea-time" >{data.curupdate}发布</div>
                    </div>
                </div>

            </div>
            <div className="middle_2Gkinvg" >
                <div className="wea-l-w" >
                    <div className="wea-img" style={{backgroundImage:`url(http://storage.jd.com/open-chat-m/themetest/weather/${data.img}.png)`}} ></div>
                    <div className="wea-list" >
                        <span className="wea-tep" >{data.tep}</span>
                        <span className="wea-deg" >°</span>
                        <div className="wea-text">{data.text}</div>
                    </div>
                    <div className="wea-t2">
                        <div className="wea-t2-1" >{data.wd} {data.ws}级</div>
                        <div className="wea-t2-1" >空气优 40</div>
                        <div className="wea-t2-1" >相对湿度 79%</div>
                    </div>
                </div>
                <div className="wea-tt" >
                    <div className="wea-t3" >
                        <div className="wea-t3-1" >今天</div>
                        <div className="wea-t3-2" style={{backgroundImage:`url(http://storage.jd.com/open-chat-m/themetest/weather/${data.day1.code_day}.png)`}}></div>
                        <div className="wea-t3-3" >{data.day1.text_day} / {data.day1.text_night}</div>
                        <div className="wea-t3-4" >{data.day1.low}°/{data.day1.high}°</div>
                    </div>
                    <div className="wea-t4" >
                    <div className="wea-t3-1" >明天</div>
                        <div className="wea-t3-2" style={{backgroundImage:`url(http://storage.jd.com/open-chat-m/themetest/weather/${data.day2.code_day}.png)`}}></div>
                        <div className="wea-t3-3" >{data.day2.text_day} / {data.day2.text_night}</div>
                        <div className="wea-t3-4" >{data.day2.low}°/{data.day2.high}°</div>
                    </div>
                    <div className="wea-t5" >
                    <div className="wea-t3-1" >后天</div>
                        <div className="wea-t3-2" style={{backgroundImage:`url(http://storage.jd.com/open-chat-m/themetest/weather/${data.day3.code_day}.png)`}}></div>
                        <div className="wea-t3-3" >{data.day3.text_day} / {data.day3.text_night}</div>
                        <div className="wea-t3-4" >{data.day3.low}°/{data.day3.high}°</div>
                    </div>
                </div>
                <div  className="wea-t6"><span > </span><span >dyxuan</span></div>
            </div>
            </div>}
        </div>
        )
    }
}