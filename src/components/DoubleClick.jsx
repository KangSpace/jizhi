import React, { Component } from 'react';
import PropTypes from 'prop-types';

// 双击
class DoubleClick extends Component {
  // 是否在进行点击
  isClick = false;
  // 点击次数
  clickNum = 0;
  // 判断点击类型
  getClickCount = () => {
    let { singleClick, doubleClick, params, container } = this.props;
    this.clickNum++;
    // 毫秒内点击过后阻止执行定时器
    if (this.isClick) {
      return;
    }
    // 毫秒内第一次点击
    this.isClick = true;
    // container = this.props.children;
    setTimeout(() => {
      // 超过1次都属于双击
      if (this.clickNum > 1) {
        doubleClick && doubleClick(container, params);
      } else {
        singleClick && singleClick(container, params);
      }
      this.clickNum = 0;
      this.isClick = false;
    }, 300);
  };

  render() {
    return (
      <div className="double-click" onClick={this.getClickCount}>
        {/* eslint-disable-next-line react/prop-types */}
        {this.props.children}
      </div>
    );
  }
}

DoubleClick.propTypes = {
  doubleClick: PropTypes.func.isRequired,
  singleClick: PropTypes.func,
  params: PropTypes.object,
  container: PropTypes.object,
};

export default DoubleClick;
