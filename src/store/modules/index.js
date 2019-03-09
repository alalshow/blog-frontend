//•store: Ducks 구조를 적용시킨 리덕스 모듈들과 스토어 생성 함수가 들어 있습니다.
export { default as editor } from './editor';
export { default as list } from './list';
export { default as post } from './post';
export { default as base } from './base';
export { penderReducer as pender } from 'redux-pender';