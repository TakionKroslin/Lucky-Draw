import pandas as pd
import sys
import os

def convert_to_js_database(file_path):
    """
    将包含 '网名'、'真实姓名'、'头像位置' 的表格文件转换为JavaScript数组格式，并保存到TXT文件。

    Args:
        file_path (str): CSV或Excel文件的路径。
    """
    print(f"正在读取文件: {file_path}...")
    
    try:
        # 根据文件扩展名选择合适的读取函数
        if file_path.endswith(('.xlsx', '.xls')):
            # 读取Excel文件
            df = pd.read_excel(file_path, sheet_name=0)
        elif file_path.endswith('.csv'):
            # 读取CSV文件
            df = pd.read_csv(file_path, encoding='utf-8')
        else:
            print("错误：文件格式不支持。请使用 .csv 或 .xlsx 文件。")
            return

    except FileNotFoundError:
        print(f"错误：文件未找到，请检查路径是否正确：{file_path}")
        return
    except Exception as e:
        print(f"读取文件时发生错误: {e}")
        return

    # 1. 统一列名以匹配JS对象键名
    df.rename(columns={
        '网名': 'nickname',
        '真实姓名': 'realname',
        '头像位置': 'avatarUrl',
        '序号': 'ID' 
    }, inplace=True)
    
    # 移除 ID 列（如果有）
    if 'ID' in df.columns:
        df = df.drop(columns=['ID'])

    # 2. 验证关键列是否存在
    required_cols = ['nickname', 'realname', 'avatarUrl']
    if not all(col in df.columns for col in required_cols):
        print("\n--- 错误提示 ---")
        print("表格中缺少关键列。请确保表格包含以下三列：")
        print("'网名', '真实姓名', '头像位置'")
        print(f"脚本检测到的列名是: {list(df.columns)}")
        return

    # 3. 构建 JavaScript 数组字符串
    data_list = df[required_cols].to_dict('records')

    js_output = "// 请将以下代码复制粘贴到 index.html 的 <script> 标签内，替换 database 变量\n"
    js_output += "const database = [\n"

    for item in data_list:
        # 清理数据：确保值是字符串，并对引号进行转义
        nickname = str(item.get('nickname', '')).replace('"', '\\"')
        realname = str(item.get('realname', '')).replace('"', '\\"')
        avatarUrl = str(item.get('avatarUrl', '')).replace('"', '\\"')
        
        # 格式化为JavaScript对象格式
        js_output += f"    {{ nickname: \"{nickname}\", realname: \"{realname}\", avatarUrl: \"{avatarUrl}\" }},\n"

    js_output += "];\n"
    
    # --- 4. 【核心修改】写入到本地文件 ---
    output_file_name = 'database_output.txt' 
    
    try:
        # 使用 with open 写入文件，w 模式表示覆盖写入
        with open(output_file_name, 'w', encoding='utf-8') as f:
            f.write(js_output)
        
        # 打印成功消息和文件位置
        print("\n" + "=" * 50)
        print("--- ✅ 转换成功！ ---")
        print(f"JavaScript 代码已保存到文件： {output_file_name}")
        print(f"文件位置： {os.path.abspath(output_file_name)}")
        print(f"请打开此文件，复制其中的内容到 index.html 中。")
        print("=" * 50)
        
    except Exception as e:
        print(f"写入文件时发生错误: {e}")


if __name__ == "__main__":
    
    file_to_convert = 'nicknames.xlsx' # <-- 请根据你的实际文件名修改这里
    
    # 检查 pandas 是否安装 (保持依赖检查)
    try:
        import pandas
    except ImportError:
        print("\n[依赖缺失] 请先安装 pandas 和 openpyxl 库。")
        print("请在命令行运行:")
        print("pip install pandas openpyxl")
        sys.exit(1)

    convert_to_js_database(file_to_convert)