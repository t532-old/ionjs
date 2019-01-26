<div class="homepage-header">
    <div class="homepage-header--positioner">
        <h1 class="homepage-header-title">Ionjs</h1>
        <div class="homepage-header-link">
            <a href="/guide/getting-started.html" class="homepage-header-link-item homepage-header-link-item--start">起步</a>
            <a href="https://github.com/ionjs-dev/ionjs" class="homepage-header-link-item homepage-header-link-item--gh">GITHUB</a>
        </div>
    </div>
</div>

::: vue
$ npm install [`@ionjs/core`](https://npmjs.com/package/@ionjs/core)
:::

> Yet Another QQ Bot Framework Based on CoolQ & CQHTTP.

## [异步 I/O](/guide/using-sessions.html#使用上下文与用户交互)
Ion.js 对于消息的获取和发送采用简便、易于编写的基于 async/await 的异步 I/O，摆脱了回调地狱和事件监听器。

## [实用](/api/namespaces.html)[工具](/api/classes.html#botwhen)
Ion.js 有一系列实用工具，用以方便地转换 CQ 码，解析消息，进行条件判断等。

## [会话](/guide/using-sessions.html)
在 Ion.js 中，一个逻辑不必只处理一条消息。你可以使用诸如 `await get()` 的异步函数来在一条逻辑中获得多条消息，以创建与用户持续交互的会话。

## [中间件](/guide/using-middlewares.html)
Ion.js 的中间件系统是完整的类 [koa](https://koajs.com) 实现，数据流向下游，控制权流回上游。基于中间件，你可以构建完善的消息预处理。

## [命令](/guide/using-commands.html)
Ion.js 提供了更强大的命令声明与解析，包括一系列特性：具名参数、引号转义、默认值等等，这些在其他许多框架都是无法获取的。

## [可选 package](/packages/index.html)
你可以为 Ion.js 添加一系列可选的 packages，来实现权限管理、自动处理请求、复读等。

<style>
    .homepage-header,
    .homepage-header * {
        box-sizing: border-box;
    }

    .homepage-header {
        background-color: black;
        background-repeat: no-repeat;
        background-size: cover;
        height: 90vh;
        width: 100%;
        box-shadow: gray 0 0 20px -3px;
    }

    .homepage-header-title {
        color: white;
        font-weight: normal;
        text-transform: uppercase;
        letter-spacing: 1em;
    }

    .homepage-header-link-item {
        display: inline-block;
        width: 7em;
        padding: 0.5em;
        margin: 1em 1em 0 0;
        border: solid 2px #fff;
        color: #fff;
        text-align: center;
        transition: 0.1s;
    }

    .homepage-header-link-item:hover {
        box-shadow: gray 0 0 20px;
    }

    .homepage-header-link-item:active {
        box-shadow: gray 0 0 10px;
    }

    .homepage-header-link-item--start {
        background-color: white;
        color: black;
    }

    .homepage-header--positioner {
        width: auto;
    }
    
    @media (min-width: 700px) {
        .homepage-header {
            background-image: url("/static/background-wide.svg");
            max-height: 700px;
        }
        .homepage-header--positioner {
            position: relative;
            left: 25em;
            top: 13em;
        }
    }

    @media (max-width: 700px) and (min-width: 500px) {
        .homepage-header {
            background-image: url("/static/background-narrow.svg");
            max-height: 650px;
        }
        .homepage-header--positioner {
            position: relative;
            top: 70vw;
            text-align: center;
            left: -13vw;
        }
    }

    @media (max-width: 500px) {
        .homepage-header {
            background-image: url("/static/background-narrow.svg");
            max-height: 550px;
        }
        .homepage-header--positioner {
            transform: translateX(calc(70vw - 12em)) translateY(70vw);
        }
        .homepage-header-link {
            width: 7em;
        }
    }

    @media (min-width: 420px) and (max-width: 500px) {
        .homepage-header--positioner {
            transform: translateX(calc(70vw - 14em)) translateY(70vw);
        }
    }
</style>