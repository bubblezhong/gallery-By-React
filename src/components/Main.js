require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
//获取图片相关数据
var imageDatas = require('../Data/imageDatas.json');

//使用自调用函数
imageDatas=(function genImageURL(imageDatasArr){
  //遍历数组
  for (var i=0,j=imageDatasArr.length;i<j;i++){
    //拿到单个图片数据
    var singleImageData=imageDatasArr[i];
    //为单个图片增加属性，拼接成图片的真实路径所在
    singleImageData.imageURL=require('../images/'+singleImageData.fileName);
    //重新赋值回数组
    imageDatasArr[i]=singleImageData;
  }
   return imageDatasArr
})(imageDatas);

// let yeomanImage = require('../images/yeoman.png');
//require图片的路径即可将其转为url地址
//获取区间内的一个随机值
function getRangeRandom(low,high) {
    return Math.floor(Math.random() * (high - low) + low);
}
//获取0-30度之间的一个任意正负值
function get30DegRandom() {
    return (
      (Math.random() > 0.5 ? '' :'-') + Math.floor(Math.random() * 30)
    );
}
var ImgFigure=React.createClass({
  /*
   *imgFigure的点击函数(???)
   */
  handleClick:function (e) {
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  },
   render:function () {
     var styleObj = {};
     //如果props属性中指定了这张图片的位置，则使用
     if(this.props.arrange.pos){
       styleObj = this.props.arrange.pos;
     }

      //如果图片的旋转角度有值并且不为0，添加旋转角度
     if(this.props.arrange.rotate){
       (['MozT','msT','WebkitT','t']).forEach(function (value) {
         styleObj [value + 'ransform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
       }.bind(this))
     }
     if(this.props.arrange.isCenter){
       styleObj.zIndex = 11;
     }
     var imgFigureClassName = 'img-figure';
         imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
     return(
       <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
         <img src={this.props.data.imageURL} alt={this.props.data.title} />
         <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
            <div className="img-back" onClick={this.handleClick}>
              <p>
                {this.props.data.desc}
              </p>
            </div>
         </figcaption>
       </figure>
     )
   }
});
//控制组件
var ControllerUnit = React.createClass({
  handleClick:function (e) {
    //如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应图片居中
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  },
   render:function () {
    var controllerUnitClassName = 'controller-unit';
    //如果是居中图片，显示控制按钮居中态
     if(this.props.arrange.isCenter){
       controllerUnitClassName += ' is-center';
     }
     if(this.props.arrange.isInverse){
       controllerUnitClassName += ' is-inverse';
     }
     return(
       <span className={controllerUnitClassName} onClick={this.handleClick}></span>
     )
   }
})
//大管家
class AppComponent extends React.Component {
  //初始化取值范围,es6初始化状态
  constructor(props){
    super(props);
  this.Constant={
    centerpos:{
      left:0,
      right:0
    },
    hPosRange:{
      leftSecX:[0,0],
      rightSecX:[0,0],
      y:[0,0]
    },
    vPosRange:{
      x:[0,0],
      topY:[0,0]
    }
  };
    this.state = {
      imgsArrangeArr:[]
    };
  } //接下来为这些常量初始化真正的值，使用componentDidMount.
  /*
   *反转图片
   * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
   * @return {function}是一个闭包函数，其内return一个真正待执行的函数
   */
  inverse (index){
    return function () {
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });
    }.bind(this)
  }
  /*
   *重新布局所有图片
   * @param centerIndex指定居中排布哪个图片
   */
  rearrange (centerIndex){
    //生成随意布局
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerpos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRighSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,
        imgsArrangeTopArr = [],               //存储布局在上部的图片状态信息
        topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
        topImgSpliceIndex = 0,//标记上部图片位于数组的哪一个位置
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);//拿到中间的图片
        //首先居中centerIndex的图片 居中图片不需要旋转
        imgsArrangeCenterArr[0] = {
          pos: centerPos,
          rotate: 0,
          isCenter: true
        };

        //取出要布局在上侧图片的状态信息，并存储在imgsArrangeTopArr中，
        topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
        //布局位于上侧图片
        imgsArrangeTopArr.forEach(function(value,index){
          imgsArrangeTopArr[index] ={
            pos:{
              top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
              left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
            },
            rotate:get30DegRandom(),
            isCenter: false
          } ;
        });
        //布局左右两侧图片
      for (var i = 0,j = imgsArrangeArr.length,k = j / 2; i < j; i ++ ){
          var hPosRangeLOR = null;
       //前半部分分布在左边，右半部分分布在右边
        if(i < k){
          hPosRangeLOR = hPosRangeLeftSecX;
        }else{
          hPosRangeLOR = hPosRangeRighSecX;
        }
        imgsArrangeArr[i] = {
           pos: {
             top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
             left:getRangeRandom(hPosRangeLOR[0],hPosRangeLOR[1])
           },
           rotate:get30DegRandom(),
          isCenter: false
        };
      }
      //splice()会直接对数组进行修改，重新将删除的元素添加回数组中
      if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
        imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
      }
      imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
      //触发重新渲染
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });
  }
/*
 *利用rearrange函数，居中对应index的图片
 * @param index，需要被居中的图片对应的图片信息数组的index值
 * @return{function}
 */
  center (index){
   return function () {
     this.rearrange(index);
   }.bind(this)
 }
//   getInitialState(){
//     //传递多个图片，使用数组
//     return{
//       imgsArrangeArr:[
//        /* {
//           pos:{left:'0',top:'0'},
  //         rotate:0
//         },*/  //在render中初始化每一个这样的状态对象
//
//       ]
//     }
// };
  //组件加载后，为每张图片计算其位置范围，在回调函数中初始化
  componentDidMount() {
    //首先拿到舞台的大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);
    //拿到一个imageFigure的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);
    //计算Constant的值
    //计算中心图片的值
    this.Constant.centerpos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };
    //计算左侧、右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    // alert(this.Constant.hPosRange.y[1]);
    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    //调用函数排布图片,调用第一张图片使其居中
    this.rearrange(0);

  }
  render() {

       //声明两个数组用来包含一系列的图片和控制按钮组件
       var controllerUnits=[],
           imgFigures=[];
       //遍历imageDates（所有的图片数据）,value是一个imageDates里面的所有属性集合，将属性imageDates传到中间ImgFigure中
       imageDatas.forEach(function(value,index){
           //初始化状态对象
         if(!this.state.imgsArrangeArr[index]){
           this.state.imgsArrangeArr[index]={
             pos:{
               top:0,
               left:0
             },
             rotate:0,
             isInverse:false,
             isCenter:false
           };
         }
         imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure'+index}
                                   arrange={this.state.imgsArrangeArr[index]}
                                    inverse={this.inverse(index)}
                                    center={this.center(index)} />);
         controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]}
                                              inverse={this.inverse(index)}
                                              center={this.center(index)}/>)
           }.bind(this));  //为函数绑定组件，使得react component对象传递到function中，在函数直接调用this
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
         </section>
         <nav className="controller-nav">
          {controllerUnits}
         </nav>

      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
