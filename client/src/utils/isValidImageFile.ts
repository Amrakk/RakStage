import { IMAGE_EXTENSIONS } from "@/constants";

export function isValidImage(file: File | string): boolean {
    if (typeof file === "string") {
        try {
            new URL(file);
            return true;
        } catch {
            return false;
        }
    }

    const ext = file.name.split(".").pop();
    if (ext && !IMAGE_EXTENSIONS.includes(ext.toLowerCase())) {
        return false;
    }
    return true;
}
