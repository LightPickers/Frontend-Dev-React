import { useEffect, useRef } from "react";
import Modal from "bootstrap/js/dist/modal";

export default function useBootstrapModal() {
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      modalInstanceRef.current = Modal.getOrCreateInstance(modalRef.current);
    }
  }, []);

  const show = () => modalInstanceRef.current?.show();
  const hide = () => modalInstanceRef.current?.hide();

  return { modalRef, show, hide };
}
