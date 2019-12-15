f = open("code.txt","a+")


for i in range(10):
    nam = input("Name: ")
    desc = input("desc: ")
    reponame = input("reponame: ")

    text = f'''<div class="card2">\n
            <h2>{nam}</h2>\n
            <h5>{desc}</h5>\n
            <a href="https://www.github.com/SubhadityaMukherjee/{reponame}">Github Link</a>\n
          </div>\n'''
    f.write(text)
    f.flush()


f.close()

