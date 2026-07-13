import zipfile, re, glob, sys, os, io

out = io.StringIO()
files = glob.glob("*.docx")
if not files:
    out.write("NO DOCX FOUND\n")

for path in files:
    out.write("=" * 80 + "\n")
    out.write("FILE: " + path + "\n")
    out.write("=" * 80 + "\n")
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
        xml = z.read("word/document.xml").decode("utf-8", errors="replace")
    xml = xml.replace("</w:p>", "\n")
    xml = xml.replace("<w:br/>", "\n").replace("<w:tab/>", "\t")
    text = re.sub(r"<[^>]+>", "", xml)
    for a, b in [("&amp;", "&"), ("&lt;", "<"), ("&gt;", ">"), ("&quot;", '"'), ("&apos;", "'")]:
        text = text.replace(a, b)
    out.write(text + "\n")

with open("_docx_dump.txt", "w", encoding="utf-8") as f:
    f.write(out.getvalue())
print("done", len(out.getvalue()))
