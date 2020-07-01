---
layout: post
title: latex from code 
date: 2020-06-30 17:24:21 +0400
toc: true
tags: latex code convert
---

I want to talk about how to get these beautiful looking latex equations without any effort at all.

So we use this really cool package called Latexify and hack it a bit to make it easy for ourselves.

```julia
]add Latexify
using Latexify
```

Since latexify outputs a string, we just need to pass the string of the function we want to it.

```julia
print(latexify("log.(exp.(ŷ)/sum(exp.(ŷ)))"))
```

But there are two annoyances - It is wayyy too long to type all the time - The latex renderer we are using (kmarkdown) needs the output to be in the format with an extra dollar before and after the expression, while this just gives "dollar string dollar" - So a little hack

```julia
function lat(x)
    print('\$')
    print(latexify(string(x)))
    print('\$')
end
```

Now we can just do this

```julia
lat("-sum(y .* logsoftmax(ŷ) .* weight) * 1 // size(y, 2)")
```

And we get this

$$\log\left( \frac{e^{ŷ}}{\mathrm{sum}\left( e^{ŷ} \right)} \right)$$
