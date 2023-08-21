# Changelog
All notable changes to this project will be documented in this file. See [conventional commits](https://www.conventionalcommits.org/) for commit guidelines.

- - -
## [v0.4.0](https://github.com/xmlking/svelte-starter-kit/compare/v0.3.0..v0.4.0) - 2022-12-25
#### Bug Fixes
- **(auth)**  workaround for https://github.com/authts/oidc-client-ts/issues/790 [skip ci] - ([a1302c4](https://github.com/xmlking/svelte-starter-kit/commit/a1302c4a9ab64b1c1048afb4d115698a0dcf28ec)) - [@xmlking](https://github.com/xmlking)
- **(build)** adding missing houdini config files to dockerignore - ([1e22416](https://github.com/xmlking/svelte-starter-kit/commit/1e2241695a48d2dedbd76cdfc4ec847298ade382)) - [@xmlking](https://github.com/xmlking)
- **(deploy)** add ORIGIN to fix CSRF error in prod - ([7699de3](https://github.com/xmlking/svelte-starter-kit/commit/7699de38204c05d202d0da48f73bce5587d6bac0)) - [@xmlking](https://github.com/xmlking)
- **(play)** add elizabot - ([a1bd369](https://github.com/xmlking/svelte-starter-kit/commit/a1bd3698dd0ff723e09356f635aafb54977e3118)) - [@xmlking](https://github.com/xmlking)
- **(play)** add container-queries play example [skip ci] - ([ae5e9b7](https://github.com/xmlking/svelte-starter-kit/commit/ae5e9b71505081242fb7c6da5dde6e09e5951047)) - [@xmlking](https://github.com/xmlking)
#### Build system
- **(deps)** updated deps - ([a8d49b3](https://github.com/xmlking/svelte-starter-kit/commit/a8d49b3c907b3b96dce72cb8ff805139c44a6771)) - [@xmlking](https://github.com/xmlking)
- **(deps)** updated deps - ([cab7c2c](https://github.com/xmlking/svelte-starter-kit/commit/cab7c2c8b5f1d101850df29c4cd9b66d77617382)) - [@xmlking](https://github.com/xmlking)
- **(deps)** updated deps [skip ci] - ([493c6eb](https://github.com/xmlking/svelte-starter-kit/commit/493c6eba2bda878b164a43266ee7140d79f89f37)) - [@xmlking](https://github.com/xmlking)
- **(houdini)** updated houdini to 0.19.0 - ([f8f29f8](https://github.com/xmlking/svelte-starter-kit/commit/f8f29f880f77e7a3d52ac7485240b7b7094bf197)) - [@xmlking](https://github.com/xmlking)
- **(houdini)** updated houdini to 0.19.0 - ([034c251](https://github.com/xmlking/svelte-starter-kit/commit/034c25161ae0798d82eae9ab8452244498fb655e)) - [@xmlking](https://github.com/xmlking)
- **(pnpm)** switch npm to pnpm - ([bb64d44](https://github.com/xmlking/svelte-starter-kit/commit/bb64d449df3a2a69b8383f73a794a21187cd4b08)) - [@xmlking](https://github.com/xmlking)
- **(pnpm)** switch npm to pnpm - ([a2beff0](https://github.com/xmlking/svelte-starter-kit/commit/a2beff0c4ee34c1195b53e8bdb43dc3bb2f3634f)) - [@xmlking](https://github.com/xmlking)
#### Documentation
- **(README)** updated todo in README - ([ac99184](https://github.com/xmlking/svelte-starter-kit/commit/ac99184d1d3f6ef0cff6b71c9103d18766e6b0d3)) - [@xmlking](https://github.com/xmlking)
- **(docs)** polish docs [skip ci] - ([098ca1a](https://github.com/xmlking/svelte-starter-kit/commit/098ca1a14297cf6be6b15aa97b4e985fbb23eb6c)) - [@xmlking](https://github.com/xmlking)
- **(docs)** polish docs [skip ci] - ([ad4a4d1](https://github.com/xmlking/svelte-starter-kit/commit/ad4a4d197cedc0a5ab23a443af4105b2b80d7d8f)) - [@xmlking](https://github.com/xmlking)
#### Features
- **(hasura)** hasura metadata, migrations sync with source - ([2a5d58d](https://github.com/xmlking/svelte-starter-kit/commit/2a5d58d3bb0fdac1ae756c463f07df52e13ef786)) - [@xmlking](https://github.com/xmlking)
- **(houdini)** adding houdini graphql client (#49) - ([42f0119](https://github.com/xmlking/svelte-starter-kit/commit/42f01192960eb6ceeb553d50ee8cc2a8105146ff)) - [@xmlking](https://github.com/xmlking)
#### Refactoring
- **(auth)** using mergeClaims: false to avoid duplicate profile picture [skip ci] - ([bffdc37](https://github.com/xmlking/svelte-starter-kit/commit/bffdc371aece921c8fedc1ace4b92b8a48f55200)) - [@xmlking](https://github.com/xmlking)
- **(blocks)** moved dashboard/blocks to lib/blocks [skip ci] - ([96e2787](https://github.com/xmlking/svelte-starter-kit/commit/96e27874b1aee584665177819a794d1139c694a9)) - [@xmlking](https://github.com/xmlking)
- **(houdini)** move houdini examples to play [skip ci] - ([e22164f](https://github.com/xmlking/svelte-starter-kit/commit/e22164f8afd6563de6bd1b8520ad333cd852432f)) - [@xmlking](https://github.com/xmlking)
- **(houdini)** move houdini client and adding some gql files [skip ci] - ([1fc63cb](https://github.com/xmlking/svelte-starter-kit/commit/1fc63cb4ea2bd754785ab6ba99b443599de7034a)) - [@xmlking](https://github.com/xmlking)
#### Style
- **(lint)** format code - ([99f81e4](https://github.com/xmlking/svelte-starter-kit/commit/99f81e4b8313186aa9ff3db7d3f2ae4f0755c7f8)) - [@xmlking](https://github.com/xmlking)
- **(svelte)** using typescript satisfies - ([dd7a25c](https://github.com/xmlking/svelte-starter-kit/commit/dd7a25c008341afe79240a439e505d8a1538d387)) - [@xmlking](https://github.com/xmlking)

- - -

## [v0.3.0](https://github.com/xmlking/svelte-starter-kit/compare/v0.2.0..v0.3.0) - 2022-11-29
#### Bug Fixes
- **(auth)** redirect immediately after detecting stale token - ([f8961d7](https://github.com/xmlking/svelte-starter-kit/commit/f8961d775af8aa38dcdd4b2ae5da510699898d1a)) - [@xmlking](https://github.com/xmlking)
- **(auth)** redirect immediately after detecting stale token - ([5b9aa51](https://github.com/xmlking/svelte-starter-kit/commit/5b9aa51e9310af887c2ff3cc0bd2ee071976ae66)) - [@xmlking](https://github.com/xmlking)
- **(auth)** redirect immediately after detecting stale token - ([72e79d7](https://github.com/xmlking/svelte-starter-kit/commit/72e79d743cdd6f0ec02bbdef05b3dcb60a923657)) - [@xmlking](https://github.com/xmlking)
- **(auth)** post_logout_redirect_uri for google - ([1c305d8](https://github.com/xmlking/svelte-starter-kit/commit/1c305d8e57f49bc45d4691938b2cd11ba042dacb)) - [@xmlking](https://github.com/xmlking)
- **(auth)** cleanup user cookies when user is stale - ([f740f92](https://github.com/xmlking/svelte-starter-kit/commit/f740f9219588c2725313f1bbade05958a6b06b4f)) - [@xmlking](https://github.com/xmlking)
- **(auth)** silent refresh fix [skip ci] - ([f290283](https://github.com/xmlking/svelte-starter-kit/commit/f290283135d675b080661e5b6213d7f23c30c91b)) - [@xmlking](https://github.com/xmlking)
- **(auth)** optmize auth.store [skip ci] - ([7ba1fcd](https://github.com/xmlking/svelte-starter-kit/commit/7ba1fcdc86e0579a39ab0040becf13839050ac9a)) - [@xmlking](https://github.com/xmlking)
- **(config)** remove un-used config [skip ci] - ([d1a3ed9](https://github.com/xmlking/svelte-starter-kit/commit/d1a3ed927514e2aa9b4882ff966de3f86561507b)) - [@xmlking](https://github.com/xmlking)
- **(deps)** updated deps[skip ci] - ([b445131](https://github.com/xmlking/svelte-starter-kit/commit/b4451318bbf99739cbe68ffe9ea04d9710b34b8b)) - [@xmlking](https://github.com/xmlking)
- **(deps)** updated deps[skip ci] - ([132fd25](https://github.com/xmlking/svelte-starter-kit/commit/132fd25f6da0c1c737ca1ff902da18fcc5b5be43)) - [@xmlking](https://github.com/xmlking)
- **(errors)** cleanup error code [skip ci] - ([feed052](https://github.com/xmlking/svelte-starter-kit/commit/feed0527c98312ad062b1540bd51e8116458b026)) - [@xmlking](https://github.com/xmlking)
- **(hasura)** polish hasura tests [skip ci] - ([d4bf0a7](https://github.com/xmlking/svelte-starter-kit/commit/d4bf0a7c32cb2099edea3b29df9a0065b28f063a)) - [@xmlking](https://github.com/xmlking)
- **(lib)** update Tags to support bind:tags [skip ci] - ([9f52ad6](https://github.com/xmlking/svelte-starter-kit/commit/9f52ad68b870a5a4a454186e2a2a1943520ebe86)) - [@xmlking](https://github.com/xmlking)
- **(lib)** tag component polich [skip ci] - ([1bc8560](https://github.com/xmlking/svelte-starter-kit/commit/1bc8560bb6057dff936e0dd76838cee282e6ed67)) - [@xmlking](https://github.com/xmlking)
- **(policy)** add client side validation along with form actions - ([2875b01](https://github.com/xmlking/svelte-starter-kit/commit/2875b01d79bce879fdc66eddf5f07e3f64f57225)) - [@xmlking](https://github.com/xmlking)
- **(policy)** add client side validation along with form actions - ([6652612](https://github.com/xmlking/svelte-starter-kit/commit/665261228db069f64fe242493f42768d6ed66b1c)) - [@xmlking](https://github.com/xmlking)
- **(policy)** lock flowbite-svelte version to 0.27.16 - ([f99e76f](https://github.com/xmlking/svelte-starter-kit/commit/f99e76f7074140b4074c72c2d323ea32cc47fdc9)) - [@xmlking](https://github.com/xmlking)
- **(policy)** add delete action [skip ci] - ([79f0123](https://github.com/xmlking/svelte-starter-kit/commit/79f0123699fed20fafff18b29ccf602bea88c208)) - [@xmlking](https://github.com/xmlking)
- **(root)** remove unused code - ([28b59eb](https://github.com/xmlking/svelte-starter-kit/commit/28b59eb9a0152c4e7a68411cc3f8171c5f217035)) - [@xmlking](https://github.com/xmlking)
- **(style)** fix lint [skip ci] - ([c088626](https://github.com/xmlking/svelte-starter-kit/commit/c0886268aa5e0aead4626bfbd5802ffc9461384d)) - [@xmlking](https://github.com/xmlking)
- **(style)** fix lint [skip ci] - ([e74e9c7](https://github.com/xmlking/svelte-starter-kit/commit/e74e9c7124c9408e4371228bf6faa8a01a3d2b63)) - [@xmlking](https://github.com/xmlking)
#### Build system
- **(deps)** bump actions/dependency-review-action from 2 to 3 (#40) - ([2b8da98](https://github.com/xmlking/svelte-starter-kit/commit/2b8da988bb6fd9d54fbc2e705d23d9e889b71e8f)) - dependabot[bot]
#### Features
- **(accounts)** add CRUD example with hasura graphql - ([e18f90e](https://github.com/xmlking/svelte-starter-kit/commit/e18f90e1ebeeabcbe8286750e299bbfbf66ff776)) - [@xmlking](https://github.com/xmlking)
- **(auth)** refactor auth, server side verification - ([7905854](https://github.com/xmlking/svelte-starter-kit/commit/79058540a15b870cec4d05836ace4ba5a157207f)) - [@xmlking](https://github.com/xmlking)
- **(auth)** replacing server-side oauth with client-side openid - ([522a610](https://github.com/xmlking/svelte-starter-kit/commit/522a6108855f7d864b5a30a6e34091c9ea655af1)) - [@xmlking](https://github.com/xmlking)
- **(auth)** replacing server-side oauth with client-side openid - ([ab5f201](https://github.com/xmlking/svelte-starter-kit/commit/ab5f2017066eb286675dbf7d0a9d5660591893cc)) - [@xmlking](https://github.com/xmlking)
#### Miscellaneous Chores
- **(auth)** auth verify stale token - ([b2cc4f1](https://github.com/xmlking/svelte-starter-kit/commit/b2cc4f123a14fb9c8f0be459b13f12a300a08f98)) - [@xmlking](https://github.com/xmlking)
- **(clsx)** switching to clsx from classnames lib - ([6d88467](https://github.com/xmlking/svelte-starter-kit/commit/6d88467af20b3ffe8d1c088a40f929ea4f769b28)) - [@xmlking](https://github.com/xmlking)
- **(deps)** deps updated [skip ci] - ([49689c1](https://github.com/xmlking/svelte-starter-kit/commit/49689c185300e1db99b75682bd2b0b136fd9667d)) - [@xmlking](https://github.com/xmlking)
- **(deps)** deps updated [skip ci] - ([513b9e2](https://github.com/xmlking/svelte-starter-kit/commit/513b9e27c598968e0606b56b9f949e4d665d19fb)) - [@xmlking](https://github.com/xmlking)
- **(mock)** remove dup mock  [skip ci] - ([094f38b](https://github.com/xmlking/svelte-starter-kit/commit/094f38bba1c30ab6d286e15ad6635a3f93627028)) - [@xmlking](https://github.com/xmlking)
- **(profile)** refactor [skip ci] - ([d6e8dce](https://github.com/xmlking/svelte-starter-kit/commit/d6e8dcee6fdc9265bc878998bf4f7395b4b21dd7)) - [@xmlking](https://github.com/xmlking)
- **(root)** updated dips, tools and docs - ([1eefe49](https://github.com/xmlking/svelte-starter-kit/commit/1eefe49c4cf95a7572098e57efe0cbb3471de138)) - [@xmlking](https://github.com/xmlking)
#### Style
- **(root)** fix lint - ([7f8689e](https://github.com/xmlking/svelte-starter-kit/commit/7f8689eba631278550df637292caa52d03f80e2c)) - [@xmlking](https://github.com/xmlking)
- **(ui)** adding DaisyUI UI components - ([387a1ab](https://github.com/xmlking/svelte-starter-kit/commit/387a1ab111cea7e50cfdecd2d2ce9c33ed06cff1)) - [@xmlking](https://github.com/xmlking)
#### Tests
- **(graphql)** add hasura graphql [skip ci] - ([2a96ddb](https://github.com/xmlking/svelte-starter-kit/commit/2a96ddb952342c99725df0bbdc178276ad81b3aa)) - [@xmlking](https://github.com/xmlking)
- **(mock)** Mock tests with msw - ([f7a2b15](https://github.com/xmlking/svelte-starter-kit/commit/f7a2b1549415c45f11954dadc681fde3964505c7)) - [@xmlking](https://github.com/xmlking)
- **(vitest)** Mock SvelteKit runtime [skip ci] - ([5d27f7a](https://github.com/xmlking/svelte-starter-kit/commit/5d27f7a584c19ab2657fbc00c9730d840f984330)) - [@xmlking](https://github.com/xmlking)

- - -

## [v0.1.0](https://github.com/xmlking/svelte-starter-kit/compare/v0.0.2..v0.1.0) - 2022-10-16
#### Bug Fixes
- **(actions)** github actions - ([c4a483e](https://github.com/xmlking/svelte-starter-kit/commit/c4a483e91e1c0abbf7aefc8ec1c96df7d448f8e3)) - [@xmlking](https://github.com/xmlking)
- **(dashboard)** add account page - ([92745b4](https://github.com/xmlking/svelte-starter-kit/commit/92745b4eda04f863d4657366c29695d2fd5abced)) - [@xmlking](https://github.com/xmlking)
- **(root)** add account and version info - ([835385d](https://github.com/xmlking/svelte-starter-kit/commit/835385d4f159c23e63e6bfbd2d7300bdb719d4dd)) - [@xmlking](https://github.com/xmlking)
#### Build system
- **(actions)** add GCP docker iamge [skip ci] - ([3716150](https://github.com/xmlking/svelte-starter-kit/commit/3716150f0fe88103927bf52fceb7d5580e413741)) - [@xmlking](https://github.com/xmlking)
#### Continuous Integration
- **(docker)** update tini [skip ci] - ([5a5d2f5](https://github.com/xmlking/svelte-starter-kit/commit/5a5d2f577f4c7b07ca3e995fcfd61316373e0c5b)) - [@xmlking](https://github.com/xmlking)
#### Documentation
- **(README)** updated README - ([eff12ff](https://github.com/xmlking/svelte-starter-kit/commit/eff12ffaee92f1c0d4d9355ee31a2642c41004a3)) - [@xmlking](https://github.com/xmlking)
- **(README)** updated README - ([677b698](https://github.com/xmlking/svelte-starter-kit/commit/677b69812c917942a3a7c8da154f81d9c45bb383)) - [@xmlking](https://github.com/xmlking)
- **(README)** updated README - ([9a6ec0c](https://github.com/xmlking/svelte-starter-kit/commit/9a6ec0c223d39d53d56f7ce305f802d51a8c1a8c)) - [@xmlking](https://github.com/xmlking)
#### Features
- **(dashboard)** adding dashboard - ([9cfed7c](https://github.com/xmlking/svelte-starter-kit/commit/9cfed7cb2fc58af4df7dd2f591ae22940fc53bef)) - [@xmlking](https://github.com/xmlking)
- **(home)** adding marketing and app modules - ([48fb0ad](https://github.com/xmlking/svelte-starter-kit/commit/48fb0adfda5ac32a5053de90aeadde0f64ae8a97)) - [@xmlking](https://github.com/xmlking)
#### Miscellaneous Chores
- **(account)** add error handling - ([a60467c](https://github.com/xmlking/svelte-starter-kit/commit/a60467cfdcd90f27fc7f6252eeac2c12db405b8f)) - [@xmlking](https://github.com/xmlking)
- **(account)** made single row header, row count at footer [skip ci] - ([fa1e936](https://github.com/xmlking/svelte-starter-kit/commit/fa1e936ada82fee186c5d700db00b769128a4908)) - [@xmlking](https://github.com/xmlking)
- **(css)** adding postcssPresetEnv [skip ci] - ([c25eb3a](https://github.com/xmlking/svelte-starter-kit/commit/c25eb3a982c48e724275c3b400e02a7149bda0cf)) - [@xmlking](https://github.com/xmlking)
- **(deps)** updated deps [skip ci] - ([0dda4b4](https://github.com/xmlking/svelte-starter-kit/commit/0dda4b43eb78e227b93214a75c0d8bee51f7fd6d)) - [@xmlking](https://github.com/xmlking)
- **(deps)** updated deps [skip ci] - ([9eab8bc](https://github.com/xmlking/svelte-starter-kit/commit/9eab8bcdf52922c3793ce1529936e06a93fe97da)) - [@xmlking](https://github.com/xmlking)
- **(deps)** dep updated [skip ci] - ([f0e5332](https://github.com/xmlking/svelte-starter-kit/commit/f0e53320b75c9fb02f14041ffd8e201aa6edb328)) - [@xmlking](https://github.com/xmlking)
- **(docker)** using build args for versionInfo [skip ci] - ([391c34d](https://github.com/xmlking/svelte-starter-kit/commit/391c34d91a967eaab7af80c0c8c170d6dee5be21)) - [@xmlking](https://github.com/xmlking)
- **(docker)** using build args for versionInfo [skip ci] - ([ee76b35](https://github.com/xmlking/svelte-starter-kit/commit/ee76b350127dd258fb946336c73805f5fd20a547)) - [@xmlking](https://github.com/xmlking)
- **(docker)** using build args for versionInfo [skip ci] - ([f0061af](https://github.com/xmlking/svelte-starter-kit/commit/f0061affbbb92927a83387d3d9718725707cc24f)) - [@xmlking](https://github.com/xmlking)
- **(docker)** using build args for versionInfo [skip ci] - ([c167c33](https://github.com/xmlking/svelte-starter-kit/commit/c167c33564ede4a0061f29f7588c11ec6f5cdafe)) - [@xmlking](https://github.com/xmlking)
- **(docker)** using build args for versionInfo [skip ci] - ([3048e48](https://github.com/xmlking/svelte-starter-kit/commit/3048e48ed1c2cf6c6c99814e3f736ca6d05b84df)) - [@xmlking](https://github.com/xmlking)
- **(root)** deps updated [skip ci] - ([7b5ff68](https://github.com/xmlking/svelte-starter-kit/commit/7b5ff683731075dfaf9bda8f53f18f18a0ea7e62)) - [@xmlking](https://github.com/xmlking)
- **(root)** deps updated [skip ci] - ([8b11464](https://github.com/xmlking/svelte-starter-kit/commit/8b114643f13b4ca675d90274b92c06436c0e0396)) - [@xmlking](https://github.com/xmlking)
- **(root)** deps updated [skip ci] - ([dc267f6](https://github.com/xmlking/svelte-starter-kit/commit/dc267f680f4ca48d8eb60bf0d9faceb956d592bf)) - [@xmlking](https://github.com/xmlking)
- **(tools)** adding vscode settings - ([5ee6085](https://github.com/xmlking/svelte-starter-kit/commit/5ee6085f98254b472473a375da9d45f969fda31c)) - [@xmlking](https://github.com/xmlking)
- **(tools)** adding vscode settings - ([65dbd5f](https://github.com/xmlking/svelte-starter-kit/commit/65dbd5f4fe0eebd8324f5bfadc8d0f7203a80148)) - [@xmlking](https://github.com/xmlking)
#### Style
- **(docs)** markdown lint fix [skip ci] - ([f25f145](https://github.com/xmlking/svelte-starter-kit/commit/f25f145fc080e4a6986a5c2d6b17a4cdcdb99a7f)) - [@xmlking](https://github.com/xmlking)
- **(root)** vscode lint fix [skip ci] - ([8d4b875](https://github.com/xmlking/svelte-starter-kit/commit/8d4b875105071589e86b2e29dff7dc2d6455efbf)) - [@xmlking](https://github.com/xmlking)
#### Tests
- **(data)** add mock data - ([0f1659f](https://github.com/xmlking/svelte-starter-kit/commit/0f1659f5e3cb0da98da85644f070328119ee2e27)) - [@xmlking](https://github.com/xmlking)
- **(data)** add mock data - ([dd30f6c](https://github.com/xmlking/svelte-starter-kit/commit/dd30f6c3b08c0af5ab880dc15b55a4e0a9d18147)) - [@xmlking](https://github.com/xmlking)
- **(data)** add mock data - ([8f5ba3a](https://github.com/xmlking/svelte-starter-kit/commit/8f5ba3a1886245884731712217ff6ee100b7b0ea)) - [@xmlking](https://github.com/xmlking)
- **(data)** add mock data - ([2d8299d](https://github.com/xmlking/svelte-starter-kit/commit/2d8299ded510cf681e839fddf0974cbafdeefd4a)) - [@xmlking](https://github.com/xmlking)
- **(data)** add mock data - ([8bec0c9](https://github.com/xmlking/svelte-starter-kit/commit/8bec0c920e5701d00a162a4a30c36d61c53e4eec)) - [@xmlking](https://github.com/xmlking)
- **(data)** add mock data - ([222c0b3](https://github.com/xmlking/svelte-starter-kit/commit/222c0b32a93666ad9efee05651d8a4487ceec59e)) - [@xmlking](https://github.com/xmlking)
- **(data)** add mock data - ([78a7ae1](https://github.com/xmlking/svelte-starter-kit/commit/78a7ae1261ac98f69571de3d3111c48c9ddcf70b)) - [@xmlking](https://github.com/xmlking)
- **(data)** add mock data - ([a8e517f](https://github.com/xmlking/svelte-starter-kit/commit/a8e517f5753387e9406bfbf2091021ebfd844e2a)) - [@xmlking](https://github.com/xmlking)
- **(data)** add mock data - ([4503c9c](https://github.com/xmlking/svelte-starter-kit/commit/4503c9cf9d85af026d2f31ec063a616b97fcf75e)) - [@xmlking](https://github.com/xmlking)
- **(test)** test mockend [skip ci] - ([20445c9](https://github.com/xmlking/svelte-starter-kit/commit/20445c9077a859a5d49dad08e26a2bcd1b875587)) - [@xmlking](https://github.com/xmlking)
- **(test)** test mockend [skip ci] - ([9404bf5](https://github.com/xmlking/svelte-starter-kit/commit/9404bf5f880e271d0873624ea9e58d9ecc9eaabc)) - [@xmlking](https://github.com/xmlking)
- **(test)** test mockend [skip ci] - ([9363b5d](https://github.com/xmlking/svelte-starter-kit/commit/9363b5dd643df56175dc07d21c3edfb1f1a4ff64)) - [@xmlking](https://github.com/xmlking)
- **(tests)** updated e2e tests - ([14dcecc](https://github.com/xmlking/svelte-starter-kit/commit/14dceccb99e8f594f1d6185b24b6950fdb416836)) - [@xmlking](https://github.com/xmlking)
- **(toot)** fix e2e and unit tests - ([39ae671](https://github.com/xmlking/svelte-starter-kit/commit/39ae671e77cd021674cec3d445620e2109ac2b2f)) - [@xmlking](https://github.com/xmlking)

- - -

## [v0.0.2](https://github.com/xmlking/svelte-starter-kit/compare/v0.0.1..v0.0.2) - 2022-09-12
#### Bug Fixes
- **(static)** add favicons - ([ca1aaa9](https://github.com/xmlking/svelte-starter-kit/commit/ca1aaa9b6fa10be4b93af7a2c220b843259fbd98)) - [@xmlking](https://github.com/xmlking)
- **(style)** add tailwindcss and flowbite - ([28a7ea8](https://github.com/xmlking/svelte-starter-kit/commit/28a7ea8773b5b26cf745652ea6360994762add4c)) - [@xmlking](https://github.com/xmlking)
#### Build system
- **(action)** fix docker/login-action - ([73c3acf](https://github.com/xmlking/svelte-starter-kit/commit/73c3acf0cebf96e1d86527eaa623bb30283495a4)) - [@xmlking](https://github.com/xmlking)
- **(action)** fix codeQL github action - ([dda4121](https://github.com/xmlking/svelte-starter-kit/commit/dda412156e953b23eb389a469747ef0c56977804)) - [@xmlking](https://github.com/xmlking)
#### Tests
- **(tests)** add vitest with svelte-add-vitest - ([2b8615e](https://github.com/xmlking/svelte-starter-kit/commit/2b8615e1e5f514c4da6e1ebb7adfd9ab8239f562)) - [@xmlking](https://github.com/xmlking)

- - -

## [v0.0.1](https://github.com/xmlking/svelte-starter-kit/compare/a7999505180b4a8dc4c687c79b3692f0bec11b94..v0.0.1) - 2022-09-11
#### Bug Fixes
- **(tools)** fix dockerfile build path - ([2f42bd3](https://github.com/xmlking/svelte-starter-kit/commit/2f42bd3e04dfb662bfbaeff403a838f86b606309)) - [@xmlking](https://github.com/xmlking)
- **(tools)** adding sveltekit static and node adapters - ([c58368e](https://github.com/xmlking/svelte-starter-kit/commit/c58368e36377f7a761093532caf54eef8d54d5ce)) - [@xmlking](https://github.com/xmlking)
#### Build system
- **(tools)** set version in package.json to 0.0.0 - ([20076b6](https://github.com/xmlking/svelte-starter-kit/commit/20076b667856803da8a27af71d134b15ad07c415)) - [@xmlking](https://github.com/xmlking)
- **(tools)** adding cog.toml - ([8f9cbf1](https://github.com/xmlking/svelte-starter-kit/commit/8f9cbf16b49a96bcdc4ecbae2c4fa788f4e20352)) - [@xmlking](https://github.com/xmlking)
#### Documentation
- **(docker)** updated docker build script - ([a7c5a32](https://github.com/xmlking/svelte-starter-kit/commit/a7c5a326505ddda13ed60d198d5bbf4d9df1c678)) - [@xmlking](https://github.com/xmlking)
#### Miscellaneous Chores
- **(root)** adding docker - ([c9bf894](https://github.com/xmlking/svelte-starter-kit/commit/c9bf894dfa45d92d615ec4c25d5eab14dd370db2)) - [@xmlking](https://github.com/xmlking)

- - -

Changelog generated by [cocogitto](https://github.com/cocogitto/cocogitto).
