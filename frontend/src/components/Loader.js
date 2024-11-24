const Loader = ({ textToDisplay }) => {
    return (
        <>
        <div className="flex flex-col items-center justify-center h-screen mt-[-100px]">
            <div
                className="w-16 h-16 border-4 border-solid rounded-full animate-spin mb-4"
                style={{
                    borderColor: "var(--primary-color)", // Sets the border color to #FFA500
                    borderTopColor: "transparent" // Keeps the top border transparent for the spinning effect
                }}
            ></div>
            <span className="text-lg font-semibold text-gray-700">{textToDisplay}</span>
            </div>
        </>
    );
};

export default Loader;
