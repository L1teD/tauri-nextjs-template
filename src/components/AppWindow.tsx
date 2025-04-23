import TitleBar from "./Titlebar";

const AppWindow = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="flex flex-col">
            <div className="h-[28px]">
                <TitleBar />
            </div>
            <div className="h-full">
                {children}
            </div>
        </div>
    );
}

export default AppWindow;