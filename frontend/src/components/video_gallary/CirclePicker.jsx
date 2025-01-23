import { Button } from "antd";
import { Add } from "../../assets/svgIcons";
import { BiSolidEyedropper } from "react-icons/bi";

function CirclePicker({ colors, colorRef, applyColor }) {
  console.log(colors);

  // function executeFunction(color){
  //   if(applyColor){
  //     applyColor(color)
  //   }
  // }
  const openEyeDropper = async () => {
    if (window.EyeDropper) {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        applyColor(result.sRGBHex);
      } catch (err) {
        console.error("EyeDropper error:", err);
      }
    } else {
      alert("Your browser does not support the EyeDropper API.");
    }
  };
  return (
    <div>
      <h1 fontSize={"12px"} fontWeight={"bold"}>
        SIMPLE LIGHT
      </h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          maxWidth: "250px",
          alignItems: "center",
          gap: "5px",
          margin: "5px 0px",
        }}
      >
        {[
          "#000000",
          "#ffffff",
          "#595959",
          // "#eeeeee",
          "#4285f4",
          "#78909c",
          "#ffab40",
          "#0097a7",
          "#eeff41",
        ]?.map((el, i) => {
          return (
            <div
              key={el}
              style={{
                background: el,
                outline: `0.5px solid rgba(0,0,0,0.2)`,
                height: "20px",
                width: "20px",
                borderRadius: "50px",
                cursor: "pointer",
              }}
              onClick={() => {
                applyColor(el);
              }}
            ></div>
          );
        })}

        <button
          size="small"
          onClick={() => {
            // colorRef.current.click()
            let colorpickerinput = document.getElementById("colorpickerinput");
            colorpickerinput.click();
          }}
        >
          <Add />
        </button>
        <button size="small" style={{ width: "20px" }} onClick={openEyeDropper}>
          <BiSolidEyedropper />
        </button>
      </div>
      <hr />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          maxWidth: "250px",
          gap: "5px",
          mt: "5px",
        }}
      >
        {colors?.map((el, i) => {
          return (
            <div
              key={el}
              style={{
                background: el,
                outline: `0.5px solid rgba(0,0,0,0.2)`,
                height: "20px",
                width: "20px",
                borderRadius: "50px",
                cursor: "pointer",
              }}
              onClick={() => {
                applyColor(el);
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}

export default CirclePicker;
