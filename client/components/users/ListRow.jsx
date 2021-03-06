import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import toastr from 'toastr';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import EditUserRole from './EditUserRole';
import * as allActions from '../../actions/UserAction';
/**
 * ListRow defined as class component. It's a root component
 */
class ListRow extends Component {
  /**
   * Class constructor
   * @param  {Object} props Component property
   * @return {void}
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      user: Object.assign({}, props.user),
    };
    this.deleteUser = this.deleteUser.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  /**
   * Handles change of state
   */
  onChange(event) {
    event.preventDefault();
    const field = event.target.name,
      user = this.state.user;
    user[field] = event.target.value;
    this.setState({ user });
    this.props.actions.updateUser(user)
    .then(() => {
      toastr.success('Role was updated successfully');
      this.context.router.push('/user');
    });
  }
  deleteUser(userid) {
    swal({
      title: 'Are you sure you want to delete this User?',
      text: ' Press cancel to quit this operation',
      type: 'warning',
      showCancelButton: true,
      closeOnConfirm: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#ec6c62'
    }, (isConfirm) => {
      if (isConfirm) {
        this.props.actions.deleteUser(userid);
        swal('Deleted!',
        'User has been deleted successfully!', 'success');
        window.location.reload();
        this.context.router.push('/user');
      } else {
        swal('Cancelled', 'User not deleted :)', 'error');
      }
    });
  }
  /**
   * renders to the DOM
   * @return {Object}
   */
  render() {
    const { user, authenticate } = this.props;
    return (
      <tr>
        <td>{user.id}</td>
        <td>{user.username}</td>
        <td>{user.firstName}</td>
        <td>{user.lastName}</td>
        <td>{user.email}</td>
        <td>{authenticate.user.userId !== user.id ? <EditUserRole
            value={parseInt(this.state.user.roleId, 10)}
            onChange={this.onChange} /> : <span>{user.Role.title}</span>
          }
        </td>
        <td>{moment(user.createdAt).format('DD-MM-YYYY')}</td>
        <td>{authenticate.user.userId !== user.id &&
          <Link
            to="/user"
            onClick={() => this.deleteUser(user.id)}>
            Delete
          </Link>}
        </td>
      </tr>
    );
  }
}
ListRow.propTypes = {
  user: React.PropTypes.object.isRequired,
  deleteUser: React.PropTypes.func,
  authenticate: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired
};

ListRow.contextTypes = {
  router: React.PropTypes.object,
};

/**
 * States to expose as props
 */
const mapStateToProps = (state) => {
  return {
    authenticate: state.auth
  };
};

/**
 * Maps state to component properties
 * @param {Object} release
 */
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(allActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListRow);
