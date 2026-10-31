"""Create a directory tree from a simple XML file/folder description.

Expected XML format:
    <folder name="rahmath-teacher-portfolio">
      <file name="index.html" />
      <folder name="css">
        <file name="style.css" />
      </folder>
    </folder>

Files are created empty. Existing files and folders are left in place.
"""

from pathlib import Path
import xml.etree.ElementTree as ET


def safe_name(element: ET.Element) -> str:
    """Return a safe single path component from a file/folder element."""
    name = element.get("name", "")
    if not name or name in {".", ".."} or "/" in name or "\\" in name:
        raise ValueError(f"Invalid or missing name on <{element.tag}>: {name!r}")
    return name


def create_from_element(element: ET.Element, parent: Path) -> None:
    if element.tag not in {"file", "folder"}:
        raise ValueError(f"Unexpected XML element: <{element.tag}>")

    path = parent / safe_name(element)

    if element.tag == "folder":
        if element.text and element.text.strip():
            raise ValueError(f"Unexpected text inside folder {path}")
        path.mkdir(exist_ok=True)
        for child in element:
            create_from_element(child, path)
    else:
        if len(element):
            raise ValueError(f"A file cannot contain child elements: {path}")
        if element.text and element.text.strip():
            raise ValueError(f"Unexpected text inside file element for {path}")
        path.touch(exist_ok=True)


def main() -> None:
    xml_input = input("Enter the path to the XML file: ").strip().strip('"')
    destination_input = input("Enter the destination location: ").strip().strip('"')

    xml_path = Path(xml_input).expanduser()
    destination = Path(destination_input).expanduser()

    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()
        if root.tag != "folder":
            raise ValueError("The XML root element must be <folder name=\"...\">.")

        # Create the requested destination if it does not already exist.
        destination.mkdir(parents=True, exist_ok=True)
        create_from_element(root, destination)
        print(f"Folder structure created at: {destination / safe_name(root)}")
    except (OSError, ET.ParseError, ValueError) as error:
        print(f"Could not create the folder structure: {error}")


if __name__ == "__main__":
    main()
