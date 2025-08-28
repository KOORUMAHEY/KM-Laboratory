function updatetag(tag) {
    const input = document.getElementById("userInput").value || "Hello World";
    let result = "";

    switch (tag) {
        case "bold": result = `<b>${input}</b>`; break;
        case "italic": result = `<i>${input}</i>`; break;
        case "underline": result = `<u>${input}</u>`; break;
        case "strong": result = `<strong>${input}</strong>`; break;
        case "em": result = `<em>${input}</em>`; break;
        case "small": result = `<small>${input}</small>`; break;
        case "strike": result = `<strike>${input}</strike>`; break;
        case "tt": result = `<tt>${input}</tt>`; break;
        case "p": result = `<p>${input}</p><p>This is a second paragraph.</p>`; break;
        case "linebreak": result = `First Line: ${input}<br>Second Line.`; break;
        case "hr": result = `Above HR: ${input}<hr>Below HR.`; break;

        // Headings
        case "heading1": result = `<h1>${input}</h1>`; break;
        case "heading2": result = `<h2>${input}</h2>`; break;
        case "heading3": result = `<h3>${input}</h3>`; break;
        case "heading4": result = `<h4>${input}</h4>`; break;
        case "heading5": result = `<h5>${input}</h5>`; break;
        case "heading6": result = `<h6>${input}</h6>`; break;

        // Lists
        case "list":
            result = `<ul><li>${input}</li><li>Item 2</li><li>Item 3</li></ul>`;
            break;
        case "orderlist":
            result =    `<ol><li>${input}</li>
<li>Item 2</li><li>Item 3</li></ol>`;
            break;
        case "menu":
            result = `<menu><li>${input}</li><li>Menu 2</li><li>Menu 3</li></menu>`;
            break;
        case "deflist":
            result = `<dl><dt>${input}</dt><dd>Definition 1</dd><dt>Term 2</dt><dd>Definition 2</dd></dl>`;
            break;

        // Interactive Elements
        case "anchor":
            result = `<a href="#">${input}</a>`;
            break;
        case "input":
            result = `<input type="text" value="${input}" />`;
            break;
        case "form":
            result = `<form><label>Name:</label><input type="text" value="${input}" /><button type="submit">Submit</button></form>`;
            break;
        case "select":
            result = `<select><option>${input}</option><option>Option 2</option></select>`;
            break;
        case "textarea":
            result = `<textarea>${input}</textarea>`;
            break;
        case "checkbox":
            result = `<label><input type="checkbox" checked /> ${input}</label>`;
            break;
        case "radio":
            result = `<label><input type="radio" checked /> ${input}</label>`;
            break;

        // Media
        case "image":
            result = `<img src="https://via.placeholder.com/200x150?text=${encodeURIComponent(input)}" alt="${input}" />`;
            break;
        case "embed":
            result = `<embed src="https://www.example.com" width="300" height="200" />`;
            break;

        // Tables
        case "table":
            result = `<table border="1"><tr><td>${input}</td><td>Col 2</td></tr></table>`;
            break;
        case "table_advanced":
            result = `<table border="1"><tr><th>${input}</th><th>Col 2</th><th>Col 3</th></tr><tr><td>1</td><td>2</td><td>3</td></tr></table>`;
            break;

        // Document Structure
        case "html":
            result = `&lt;html&gt;<br>&nbsp;&nbsp;&lt;head&gt;&lt;/head&gt;<br>&nbsp;&nbsp;&lt;body&gt;${input}&lt;/body&gt;<br>&lt;/html&gt;`;
            break;
        case "head":
            result = `&lt;head&gt;<br>&nbsp;&nbsp;&lt;title&gt;${input}&lt;/title&gt;<br>&lt;/head&gt;`;
            break;
        case "body":
            result = `&lt;body&gt;${input}&lt;/body&gt;`;
            break;
        case "title":
            result = `&lt;title&gt;${input}&lt;/title&gt;`;
            break;
        case "meta":
            result = `&lt;meta name="description" content="${input}"&gt;`;
            break;
        case "comment":
            result = `&lt;!-- ${input} --&gt;`;
            break;

        // Deprecated
        case "big":
            result = `<big>${input}</big>`; break;
        case "center":
            result = `<center>${input}</center>`; break;
        case "font":
            result = `<font color="red">${input}</font>`; break;
        case "marquee":
            result = `<marquee>${input}</marquee>`; break;

        default:
            result = "Invalid tag selected.";
    }

    document.getElementById("result").innerHTML = result;
    document.getElementById("code").innerText = result;
}
