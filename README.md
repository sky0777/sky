# 火候

先看会怎样，再动手。原创做菜原型：同一套示意，既可以探索，也可以实做。

演示数据在 `src/data/recipes.ts`。内容是原创说明，不是引自任何书。

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`。

静态预览：

```bash
npm run build
npm run preview
```

## 路径

- `/` 首页
- `/cook/:id` 短原理，选择探索或实战
- `/cook/:id/explore` 调火力、时间、分量，看示意变化
- `/cook/:id/play` 按步骤做，计时器带动画面

探索里的时钟是压缩过的模拟，不必真下锅。实战计时按一小份家庭烹饪来估，到点会停住。
