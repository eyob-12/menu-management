"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenus, updateMenuItem, deleteMenuItem } from "@/redux/slice/menuSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { FaChevronDown, FaChevronRight, FaPlus } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import { base_url } from "@/utils/base_url";

// Define TypeScript Type for a Menu Item
interface MenuItem {
    id: string;
    name: string;
    parentId: string | null;
    children?: MenuItem[];
    depth?: number;
}

const MenuTree = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { menus, loading } = useSelector((state: RootState) => state.menu);

    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
    const [formData, setFormData] = useState({
        id: "",
        depth: "",
        parentData: "",
        name: "",
    });

    useEffect(() => {
        dispatch(fetchMenus());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;
    if (!menus.length) return <p>No menus found</p>;

    // Find the root menu (where parentId is null)
    const rootMenu = menus.find((menu: MenuItem) => menu.parentId === null);
    if (!rootMenu) return <p>No root menu found</p>;

    // Recursive function to build a menu tree
    const buildTree = (menu: MenuItem, depth = 1): MenuItem => {
        const children = menus.filter((m: MenuItem) => m.parentId === menu.id);
        return { ...menu, children: children.map((child) => buildTree(child, depth + 1)), depth };
    };

    const structuredMenu = buildTree(rootMenu);

    const handleToggle = (id: string) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSelectMenu = (menu: MenuItem) => {
        setSelectedMenu(menu);
        setFormData({
            id: menu.id,
            depth: menu.depth?.toString() || "1",
            parentData: menu.parentId ? menus.find((m: MenuItem) => m.id === menu.parentId)?.name || "" : "Root",
            name: menu.name,
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        dispatch(updateMenuItem({ id: formData.id, name: formData.name }));
        alert("Menu updated successfully!");
    };

    const handleAddChild = async (parentId: string) => {
        const newMenu = { name: "New Item", parentId };

        await fetch(`${base_url}/menus`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMenu),
        });

        dispatch(fetchMenus());
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this menu item?")) {
            dispatch(deleteMenuItem(id));
        }
    };

    // Expand All & Collapse All
    const expandAll = () => {
        const allExpanded = menus.reduce((acc, menu) => ({ ...acc, [menu.id]: true }), {});
        setExpanded(allExpanded);
    };

    const collapseAll = () => {
        setExpanded({});
    };

    const renderMenu = (menu: MenuItem) => {
        const isExpanded = expanded[menu.id] || false;

        return (
            <div key={menu.id} className="ml-4">
                <div className="flex items-center justify-between cursor-pointer hover:text-blue-500">
                    <div className="flex items-center gap-2" onClick={() => handleSelectMenu(menu)}>
                        {menu.children && menu.children.length > 0 ? (
                            <button onClick={() => handleToggle(menu.id)} className="text-gray-500">
                                {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                            </button>
                        ) : (
                            <span className="w-3" />
                        )}
                        <span className="text-gray-800 font-medium">{menu.name}</span>
                        <button onClick={() => handleAddChild(menu.id)} className="text-gray-50 bg-blue-500 p-1 rounded-full">
                            <FaPlus size={20} />
                        </button>
                    </div>
                </div>

                {isExpanded && menu.children && menu.children.length > 0 && (
                    <div className="ml-6 border-l-2 border-gray-300 pl-2">
                        {menu.children.map(renderMenu)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white p-4 shadow-md rounded-lg w-full flex flex-col md:flex-row gap-6">
            {/* Menu Tree Section */}
            <div className="md:w-2/3 w-full">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <span className="bg-blue-500 text-white p-2 rounded-full"><FiGrid /></span> Menus
                </h2>

                {/* Expand & Collapse Buttons */}
                <div className="flex gap-2 my-3">
                    <button onClick={expandAll} className="bg-gray-900 text-white px-3 py-1 rounded">Expand All</button>
                    <button onClick={collapseAll} className="bg-gray-50 text-gray-950 px-3 py-1 rounded">Collapse All</button>
                </div>

                {renderMenu(structuredMenu)}
            </div>

            {/* Edit Section */}
            <div className="md:w-1/3 w-full bg-gray-100 p-4 rounded-lg">
                {selectedMenu ? (
                    <>
                        <div className="mb-3">
                            <label className="block text-gray-600 text-sm">Menu ID</label>
                            <input type="text" value={formData.id} className="w-full p-2 border rounded bg-gray-200" disabled />
                        </div>

                        <div className="mb-3">
                            <label className="block text-gray-600 text-sm">Depth</label>
                            <input type="text" value={formData.depth} className="w-full p-2 border rounded bg-gray-200" disabled />
                        </div>

                        <div className="mb-3">
                            <label className="block text-gray-600 text-sm">Parent Data</label>
                            <input type="text" value={formData.parentData} className="w-full p-2 border rounded bg-gray-200" disabled />
                        </div>

                        <div className="mb-3">
                            <label className="block text-gray-600 text-sm">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>

                        <button onClick={handleSave} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Save</button>
                        <button onClick={() => handleDelete(formData.id)} className="w-full mt-4 bg-red-500 text-white py-2 rounded">Delete</button>
                    </>
                ) : (
                    <p className="text-gray-500">Select a menu item to edit</p>
                )}
            </div>
        </div>
    );
};

export default MenuTree;
