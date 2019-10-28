# [itzmeanjan.in](https://itzmeanjan.in/)
_An opensource website_ - A simple to follow guide, for deploying your website _( or blog )_ on _Amazon LightSail_ using `systemd`

**Consider putting :star: to show :heart:**

## what does it do ?
- This repository opensources author's personal website _( both frontend & backend )_
- It's hosted on _AWS LightSail_, so main purpose is, if someone requires help on `How to deploy your backend on AWS LightSail ?`, well this may be helpful
- Well how about keeping your backend running, no matter whatever happens
- I got you covered too, backend isn't using `pm2` for keeping your _Node backend_, rather it's depending upon `systemd`
- So it doesn't matter, what your backend is made of, it can always be kept running using `systemd`
- I also have added one _GitHub Parser_, for parsing out my repositories from _Github_, and JSONifying, so that it can be used for displaying repository list [here](https://itzmeanjan.in/projects)
- Now you may be thinking, why not to automate this parser, so that it can refresh repository list _( reflecting recent changes )_ & _Node backend_ can serve updated list
- Yeah we gonna do that too, & again we'll simply use `systemd` to trigger this task every _24h_
- Haven't used any specific _JS frontend framework_, built using _HTML_, _CSS_, _JavaScript_


**Hope, it helps you, :wink:**
