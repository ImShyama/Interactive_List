// import { Modal } from "antd";

// const InstrucationTutorial = ({ open, handleClose }) => {
//   return (
//     <Modal
//       open={open}
//       onCancel={handleClose}
//       footer={null}
//       width={800}
//       centered
//       title="Instruction Video"
//     >
//       <iframe
//         width="100%"
//         height="450"
//         src="https://drive.google.com/file/d/1QKnzt5cKbZRL_kiQn0p1UGYdVLVTP8ed/preview"
//         frameBorder="0"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         allowFullScreen
//         title="Instruction Video"
//         style={{ borderRadius: "5px" }}
//       ></iframe>
//     </Modal>
//   );
// };

// export default InstrucationTutorial;



import { Modal } from "antd";

const InstrucationTutorial = ({
  open,
  handleClose,
  videoUrl = "https://drive.google.com/file/d/18DQXdpztTTV1CKpougVWg8CTzfH4EbEd/preview",
  title = "Instruction Video"
}) => {
  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={800}
      centered
      title={title}
    >
      <iframe
        width="100%"
        height="450"
        src={videoUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
        style={{ borderRadius: "5px" }}
      ></iframe>
    </Modal>
  );
};

export default InstrucationTutorial;