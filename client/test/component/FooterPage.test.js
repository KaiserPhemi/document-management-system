import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';
import FooterPage from '../../components/shared/FooterPage';
import Footer from '../../components/shared/Footer';

describe('FooterPage ', () => {
  let component, container;
  const middlewares = [thunk],
    mockStore = configureMockStore(middlewares),
    wrapper = shallow(
      <Provider store={mockStore}>
        <FooterPage />
      </Provider>);
  it('should render without crashing', () => {
    component = wrapper.find(FooterPage);
    container = component.find(Footer);
    expect(component.length).toBe(1);
    expect(container.length).toBe(0);
    expect('.button').toExist();
    
  });
});
