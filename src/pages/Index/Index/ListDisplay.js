/**
 * 首页数据列表展示
 */
import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect, useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { Card, Spin } from 'antd';
import QueueAnim from 'rc-queue-anim';
import useActions from '../../../store/useActions';
import style from './style.sass';
import { listDisplayChange } from '../reducer/reducer';

/* state */
const state = createStructuredSelector({
  listDisplay: createSelector(
    ($$state) => $$state.get('index'),
    ($$data) => $$data.get('listDisplay').toJS()
  )
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

function ListDisplay(props) {
  const [loading, setLoading] = useState(false);
  const { listDisplay } = useSelector(state);
  const action = useActions({
    listDisplayChange
  });

  // 显示list
  function listDisplayRender() {
    return (listDisplay || []).map((item, index) => {
      return (
        <li key={ index }>
          <Link to="/" title={ item }>{ item }</Link>
        </li>
      );
    });
  }

  async function getData() {
    setLoading(true);

    const data = await simulationData();

    action.listDisplayChange({
      listDisplay: data
    });

    setLoading(false);
  }

  useEffect(function() {
    getData();
  }, []);

  return (
    <Card title="数据列表展示" extra={
      <Link className={ style.more } to="/" title="更多">更多</Link>
    }>
      <Spin size="default" spinning={ loading }>
        <QueueAnim className={ style.listDisplay } component="ul" type="alpha" interval={ 0 }>
          { listDisplayRender() }
        </QueueAnim>
      </Spin>
    </Card>
  );
}

ListDisplay.propTypes = {
  listDisplay: PropTypes.array
};

export default ListDisplay;