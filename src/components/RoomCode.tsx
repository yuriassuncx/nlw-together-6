type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {
    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code)
    }

    return (
        <button className="h-12 rounded-lg overflow-hidden bg-[#FFF] border border-solid border-[#835afd] cursor-pointer flex" onClick={copyRoomCodeToClipboard}>
            <div className="bg-[#835afd] p-3 pb-4 pl-4 pt-4 flex justify-center items-center">
                <img src="/images/copy.svg" alt="Copy Room Code" />
            </div>
            <span className="block self-center flex-auto pt-0 pr-4 pb-0 pl-3 w-60 text-sm font-medium">Sala #{props.code}</span>
        </button>
    );
}