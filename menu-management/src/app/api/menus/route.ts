import { NextResponse } from "next/server";
import axios from "axios";
import { base_url } from "@/utils/base_url";

export async function GET() {
    try {
        const res = await axios.get(`${base_url}/menus`);
        return NextResponse.json(res.data);
    } catch {
        return NextResponse.json({ message: "Error fetching menus" }, { status: 500 });
    }
}
