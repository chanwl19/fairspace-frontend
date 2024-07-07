import { forwardRef, useImperativeHandle, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
    children: ReactNode;
    title: string;
};

export type DislayModalHandle = {
    open: () => void;
};

const DisplayModal = forwardRef<DislayModalHandle, ModalProps>(function Modal(
    modalProps,
    ref
) {
    const dialog = useRef<HTMLDialogElement>(null);
    useImperativeHandle(ref, () => {
        return {
            open() {
                console.log('called open')
                dialog?.current?.showModal();
            },
        };
    });

    return createPortal(
        <dialog id="displayModal" ref={dialog}>
            <h2>{modalProps.title}</h2>
            {modalProps.children}
        </dialog>,
        document.getElementById('modal')!
    );
});

export default DisplayModal;
