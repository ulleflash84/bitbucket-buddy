const body = document.querySelector("body")
const head = document.querySelector("head")
const pre = document.querySelector("pre")

function addSection(parent, title, prs) {
    if (prs.length > 0) {
        var b = document.createElement("b")
        b.textContent = title
        parent.appendChild(b)

        var ul = document.createElement("ul")
        ul.setAttribute("class", "mt-2 mb-4 list-group")
        for (var pr of prs) {
            var li = document.createElement("li")
            li.setAttribute("class", "list-group-item")

            var a = document.createElement("a")
            a.href = pr.links.self[0].href
            a.target = "_blank"
            a.textContent = pr.author.user.displayName + ": " + pr.title.replace(':', '')

            li.appendChild(a)
            ul.appendChild(li)
        }
        parent.appendChild(ul)
    }
}

function setupOverview() {
    if (body && head && pre) {
        var json = JSON.parse(pre.textContent)
        body.removeChild(pre)

        var title = document.createElement("title")
        title.textContent = "Pull Requests Overview"
        head.appendChild(title)

        var meta = document.createElement("meta")
        meta.setAttribute("content", "width=device-width, initial-scale=1")
        meta.setAttribute("name", "viewport")
        head.appendChild(meta)

        var link = document.createElement("link")
        link.setAttribute("crossorigin", "anonymous")
        link.setAttribute("href", "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css")
        link.setAttribute("integrity", "sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx")
        link.setAttribute("rel", "stylesheet")
        head.appendChild(link)

        var link = document.createElement("link")
        link.setAttribute("href", "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👨‍💻</text></svg>")
        link.setAttribute("rel", "icon")
        head.appendChild(link)

        var user_name = "UBelitz@brita.net"; // Task @UBE: get from options

        if (user_name === "") {
            var div = document.createElement("div")
            div.setAttribute("class", "alert alert-danger m-2")
            div.textContent = "Error: Please provide user name in settings."
            body.appendChild(div)
        } else if (json.errors) {
            for (var error of json.errors) {
                var div = document.createElement("div")
                div.setAttribute("class", "alert alert-danger m-2")
                div.textContent = "Error: " + error.message
                body.appendChild(div)
            }
        } else if (json.values) {
            var div = document.createElement("div")
            div.setAttribute("class", "container")
            body.appendChild(div)

            var merge_possible = []
            var merge_conflicts = []
            var review_required = []
            var open_tasks = []
            var waiting_for_approvals = []
            var work_in_progress = []
            var no_action_required = []

            for (var pr of json.values) {
                // Task @UBE: implement complete logic

                var index = pr.title.toLowerCase().indexOf("wip")
                var wip = (index >= 0 && index < 7)

                if (pr.author.user.name == user_name) {
                    if (wip) {
                        work_in_progress.push(pr)
                    } else if (pr.properties.mergeResult.outcome == "CONFLICTED") {
                        merge_conflicts.push(pr)
                    } else if (pr.properties.openTaskCount > 0) {
                        open_tasks.push(pr)
                    } else {
                        waiting_for_approvals.push(pr)
                    }
                } else {
                    var user_must_review = false
                    for (var reviewer of pr.reviewers) {
                        if (reviewer.user.name == user_name && reviewer.status == "UNAPPROVED") {
                            user_must_review = true
                            break
                        }
                    }

                    if (wip) {
                        no_action_required.push(pr)
                    } else if (user_must_review) {
                        review_required.push(pr)
                    } else {
                        no_action_required.push(pr)
                    }
                }
            }

            addSection(div, "Merge possible", merge_possible)
            addSection(div, "Merge conflicts", merge_conflicts)
            addSection(div, "Review required", review_required)
            addSection(div, "Open tasks", open_tasks)
            addSection(div, "Waiting for approvals", waiting_for_approvals)
            addSection(div, "Work in progress", work_in_progress)
            addSection(div, "No action required", no_action_required)
        } else {
            var div = document.createElement("div")
            div.setAttribute("class", "alert alert-danger m-2")
            div.textContent = "Unknown error - please try again."
            body.appendChild(div)
        }
    }
}

setupOverview()