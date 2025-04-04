import React, { useRef } from 'react';
import ReactDOM from 'react-dom';

const ModalWrapper = ({ children, open, setOpenModal ,outsideClickClose=true}) => {
    const modalRef = useRef(null);

    const closeModal = (e) => {
        if (modalRef.current === e.target && outsideClickClose) {
            setOpenModal(false);
        }
    };

    if (!open) return null;

    return ReactDOM.createPortal(
        <div

            className="bg-opacity-30 backdrop-blur-lg h-full w-full fixed z-[1000] top-0 left-0"
        >
            <div
                ref={modalRef}
                onClick={(e) => closeModal(e)}
                className="flex h-full w-full justify-center items-center bg-transparent">
                {children}
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default ModalWrapper;
