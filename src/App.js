import React, { useState } from 'react';
import 'bulma/css/bulma.css'
import '@fortawesome/fontawesome-free/css/all.css'
import './App.css';
import AgLcbXCsvTable from './Table/AgLcbXCsvTable';


function App() {
    return (
        <div className="App">

            <section className="section">
                <div className="container is-max-desktop" style={{ marginTop: '60px' }}>
                    <h1 className="title is-1">
                        Ag-LiveCodeBench-X Leaderboard
                    </h1>
                    {/* <h2 className="title is-4 has-text-centered mb-1" id="Agnostics">
                        Introduction
                    </h2> */}
                    <div className="is-size-6 has-text-centered">
                    <span>
                    The Ag-LiveCodeBench-X benchmark (part of the <a
                     href="https://agnostics.abgru.me/" target="_blank" rel="noreferrer">
                    Agnostics project
                    </a>) measures the performance of LLMs
                    on programming tasks involving low-resource programming languages.
                    The problems are drawn from the <a
                     href="https://livecodebench.github.io/" target="_blank" rel="noreferrer">
                    LiveCodeBench benchmark
                    </a>.
                    Thanks to the Agnostics project, more programming languages
                    can be added with minimal effort (4-5 lines of YAML).

                    <br></br>

                    Model sizes, if known, are specified in the model's name.

                    We plan to update the benchmark with new models.
                    If you have any suggestions or you'd like to submit results of evaluating your model,
                    please contact us at research@abgru.me.
                    </span></div>
                </div>
                <div className="columns is-centered">
                    <div className="column is-four-fifths">
                        <AgLcbXCsvTable />
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="container mb-3">
                    <div className="is-size-5 publication-authors">
                        <span className="author-block">
                            <a href="https://abgru.me" target="_blank" rel="noreferrer">
                                Aleksander Boruch-Gruszecki
                            </a><sup>1</sup>,&nbsp;
                        </span>
                        <span className="author-block">
                            <a href="https://ccs.neu.edu/~ytzi/" target="_blank" rel="noreferrer">
                                Yangtian Zi
                            </a><sup>1</sup>,&nbsp;
                        </span>
                        <span className="author-block">
                            <a href="https://aryawu0513.github.io/" target="_blank" rel="noreferrer">
                                Zixuan Wu
                            </a><sup>1</sup>,&nbsp;
                        </span>
                        <span className="author-block">
                            Tejas Oberoi<sup>2</sup>,
                        </span>
                        <br></br>
                        <span className="author-block">
                            <a href="https://canders1.github.io/" target="_blank" rel="noreferrer">
                                Carolyn Jane Anderson
                            </a><sup>3</sup>,&nbsp;
                        </span>
                        <span className="author-block">
                            <a href="https://www.cs.utexas.edu/people/faculty-researchers/joydeep-biswas" target="_blank" rel="noreferrer">
                                Joydeep Biswas
                            </a><sup>2</sup>,&nbsp;
                        </span>
                        <span className="author-block">
                            <a href="https://ccs.neu.edu/~arjunguha/main/home/">
                                Arjun Guha
                            </a><sup>1</sup>,&nbsp;
                        </span>
                    </div>

                    <div className="is-size-5 publication-authors">
                        <span className="author-block"><sup>1</sup>Northeastern University,&nbsp;</span>
                        <span className="author-block"><sup>2</sup>University of Texas,&nbsp;</span>
                        <span className="author-block"><sup>3</sup>Wellesley College</span>
                    </div>
                </div>
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-8">
                            <div className="content">
                                {/*
                                    The nbsp-s are inserted before a tag preceded by a newline.
                                    Without them there will be no whitespace between the text and the link.
                                */}
                                <p>
                                    This website is licensed under a&nbsp;
                                    <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
                                        Creative Commons Attribution-ShareAlike 4.0 International License</a>.
                                    <br></br>
                                    The site was inspired by the&nbsp;
                                    <a href="https://github.com/nerfies/nerfies.github.io" target="_blank" rel="noreferrer">
                                        Nerfies project
                                    </a>,&nbsp;
                                    <a href="https://livecodebench.github.io/" target="_blank" rel="noreferrer">
                                        LiveCodeBench
                                    </a>,
                                    and&nbsp;
                                    <a href="https://livebench.ai/#/" target="_blank" rel="noreferrer">
                                        LiveBench
                                    </a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}


export default App;
