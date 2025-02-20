import Sidebar from "@/components/Sidebar";
import MenuTree from "@/components/MenuTree";
import "../globals.css";

export default function MenusPage() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6">
                <MenuTree />
            </div>
        </div>
    );
}
