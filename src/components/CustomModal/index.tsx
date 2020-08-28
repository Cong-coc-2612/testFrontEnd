import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import Modal, { Styles } from 'react-modal';
import 'react-tabs/style/react-tabs.css';
import './styles.css';

interface ICustomModalProps extends React.ClassAttributes<CustomModal> {
  children?: ReactNode;
  showModal: boolean;
  customStyles: Styles;
  confirmButtonVisible?: boolean;

  handleCloseModal(): void;
  handleConfirmModal(): void;
}

interface IModalState {
}

class CustomModal extends React.Component<ICustomModalProps, IModalState> {
  constructor(props: ICustomModalProps) {
    super(props);
    this.state = {
    };
  }

  private handleCloseModal = () => {
    this.props.handleCloseModal();
  }

  private handleConfirmModal = () => {
    this.props.handleConfirmModal();
  }

  render() {
    return (
      <Modal
        isOpen={this.props.showModal}
        // onAfterOpen={afterOpenModal}
        onRequestClose={this.handleCloseModal}
        style={this.props.customStyles}
        ariaHideApp={false}
      >
        <div className="Modal-content-container">
        {this.props.children}
        </div>
        {this.props.confirmButtonVisible !== false && <div className="Modal-button-container">
          <div className="Modal-button" onClick={this.handleConfirmModal}>
            <p>Confirm</p>
          </div>
        </div>}
      </Modal>
    );
  }
}

export default connect(
  null,
  null
)(CustomModal);