import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';
import nock from 'nock';
import { searchDocument } from '../../../../client/actions/Search';
import * as types from '../../../../client/actions/ActionType';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('User Actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });
  it('creates ADD_USER when sign up has been done',
    () => {
      const queryString = 'queryString';
      nock('http://localhost.com/')
        .post(`/documents?q=${queryString}`)
        .reply(200, {
          body: { pagination: {},
            rows: [{ title: 'queryString', content: 'Content here' }] } });

      const expectedActions = [{
        type: types.SET_PAGINATION,
        pagination: {
          totalCount: 1,
          pageSize: 2,
          currentPage: 1,
          pageCount: 6 } },
      {
        type: types.ADD_USER,
        documents: [{
          title: 'queryString',
          content: 'Content here'
        }] }];

      const store = mockStore({ users: [] });

      store.dispatch(searchDocument(queryString))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
});