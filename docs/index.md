<div class="homepage">
    <div class="homepage-header">
        <div class="homepage-header--positioner">
            <h1 class="homepage-header-title">Ionjs</h1>
            <div class="homepage-header-link">
                <a href="/guide/getting-started.html" class="homepage-header-link-item homepage-header-link-item--start">起步</a>
                <a href="https://github.com/ionjs-dev/ionjs" class="homepage-header-link-item homepage-header-link-item--gh">GITHUB</a>
            </div>
        </div>
    </div>
</div>

<style>
    .homepage,
    .homepage * {
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
    
    @media (min-width: 700px) {
        .homepage-header {
            background-image: url("/static/background-wide.svg");
        }
        .homepage-header--positioner {
            position: relative;
            left: 22em;
            top: 13em;
        }
    }

    @media (max-width: 700px) and (min-width: 500px) {
        .homepage-header {
            background-image: url("/static/background-narrow.svg");
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
        }
        .homepage-header--positioner {
            position: relative;
            top: 70vw;
            text-align: center;
            left: 9vw;
        }
        .homepage-header-link {
            position: relative;
            margin-left: 0;
            left: 5vw;
        }
    }
</style>