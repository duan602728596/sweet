/**
 * 首页数据列表展示
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { Card, Spin } from 'antd';
import QueueAnim from 'rc-queue-anim';
import style from './style.sass';
import { listDisplayChange } from '../store/reducer';

/* state */
const state = createStructuredSelector({
  listDisplay: createSelector(
    ($$state) => $$state.get('index'),
    ($$data) => $$data.get('listDisplay').toJS()
  )
});

/* dispatch */
const dispatch = (dispatch) => ({
  action: bindActionCreators({
    listDisplayChange
  }, dispatch)
});

function simulationData() {
  return new Promise((resolve, reject) => {
    const data = [];

    for (let i = 0, j = 18; i < j; i++) {
      data.push(`这是一条测试数据 ${ i }`);
    }

    setTimeout(resolve, 1500, data);
  });
}

class ListDisplay extends Component {
  static propTypes = {
    listDisplay: PropTypes.array
  };

  constructor() {
    super(...arguments);

    this.state = {
      loading: true
    };
  }

  // 显示list
  listDisplay() {
    return this.props.listDisplay.map((item, index) => {
      return (
        <li key={ index }>
          <Link to="/" title={ item }>{ item }</Link>
        </li>
      );
    });
  }

  async componentDidMount() {
    const data = await simulationData();

    this.props.action.listDisplayChange({
      listDisplay: data
    });

    this.setState({
      loading: false
    });
  }

  render() {
    return (
      <Card title="数据列表展示" extra={
        <Link className={ style.more } to="/" title="更多">更多</Link>
      }>
        <Spin size="default" spinning={ this.state.loading }>
          <QueueAnim className={ style.listDisplay } component="ul" type="alpha" interval={ 0 }>
            { this.listDisplay() }
          </QueueAnim>
        </Spin>
      </Card>
    );
  }
}

export default connect(state, dispatch)(ListDisplay);