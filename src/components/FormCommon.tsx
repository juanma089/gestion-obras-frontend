import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface GenericModalFormProps {
  title: string;
  headerColor: string;
  onClose: () => void;
  children: ReactNode;
}

export const GenericModalForm = ({
  title,
  headerColor,
  onClose,
  children,
}: GenericModalFormProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-gradient-to-tr from-gray-900 to-gray-300 bg-opacity-50 flex items-start md:items-center justify-center z-50 p-4 overflow-y-auto"
        >
          <motion.div
            key="modal-content"
            initial={{ y: -50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
              bounce: 0.2,
            }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-auto"
          >
            {/* Cabecera */}
            <div className={`bg-gradient-to-r ${headerColor} p-4 rounded-t-2xl text-white`}>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{title}</h3>
                <button
                  onClick={handleClose}
                  className="text-white hover:text-gray-200 focus:outline-none"
                >
                  <X />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-5">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};