local os = require("os")
local repo_path = "~/newObjectccc.github.io"
local repo_url = "https://github.com/newObjectccc/newObjectccc.github.io.git"

if os.execute("cd " .. repo_path .. " 2>/dev/null") then
    -- 如果仓库存在，拉取最新的代码
    os.execute("cd " .. repo_path .. " && git pull origin main")
else
    -- 如果仓库不存在，克隆仓库
    os.execute("git clone " .. repo_url .. " " .. repo_path)
end

os.execute("cd " .. repo_path .. " && npm install && npm run docs:build")
os.execute("cd " .. repo_path .. " && docker build -t mycaddy .")
os.execute("cd " .. repo_path .. " && docker-compose up -d")