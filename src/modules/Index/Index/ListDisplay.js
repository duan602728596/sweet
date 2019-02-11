/**
 * 首页数据列表展示
 *
 * @flow
 */
import * as React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import type { RecordInstance } from 'immutable/dist/immutable.js.flow';
import { Card, Spin } from 'antd';
import QueueAnim from 'rc-queue-anim';
import style from './style.sass';
import { listDisplayChange } from '../store/reducer';

/* state */
const state: Function = createStructuredSelector({
  listDisplay: createSelector(
    ($$state: RecordInstance<Object>): RecordInstance<Object> => $$state.get('index'),
    ($$data: RecordInstance<Object>): Array<Object> => $$data.get('listDisplay').toJS()
  )
});

/* dispatch */
const dispatch: Function = (dispatch: Function): Object=>({
  action: bindActionCreators({
    listDisplayChange
  }, dispatch)
});

function simulationData(): Promise<Array<string>>{
  return new Promise((resolve: Function, reject: Function): void=>{
    const data: string[] = [];

    for(let i: number = 0, j: number = 18; i < j; i++){
      data.push(`这是一条测试数据 ${ i }`);
    }

    setTimeout(resolve, 1500, data);
  });
}

class ListDisplay extends Component<{ listDisplay: Array<Object>, action: Object }, { loading: boolean }>{
  static propTypes: Object = {
    listDisplay: PropTypes.array
  };

  constructor(): void{
    super(...arguments);

    this.state = {
      loading: true
    };
  }
  // 显示list
  listDisplay(): Array<React.Node>{
    return this.props.listDisplay.map((item: string, index: number): React.Node=>{
      return (
        <li key={ index }>
          <Link to="/" title={ item }>{ item }</Link>
        </li>
      );
    });
  }
  async componentWillMount(): Promise<void>{
    const data: Array<Object> = await simulationData();

    this.props.action.listDisplayChange({
      listDisplay: data
    });

    this.setState({
      loading: false
    });
  }
  render(): React.Node{
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