<label class="swap">
	<!-- this hidden checkbox controls the state -->
	<input type="checkbox" />

	<!-- volume on icon -->
	<svg
		class="swap-on fill-current"
		xmlns="http://www.w3.org/2000/svg"
		width="48"
		height="48"
		viewBox="0 0 24 24"
		><path
			d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
		/></svg
	>

	<!-- volume off icon -->
	<svg
		class="swap-off fill-current"
		xmlns="http://www.w3.org/2000/svg"
		width="48"
		height="48"
		viewBox="0 0 24 24"
		><path
			d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z"
		/></svg
	>
</label>

<div class="alert alert-success shadow-lg">
	<div>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 flex-shrink-0 stroke-current"
			fill="none"
			viewBox="0 0 24 24"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<span>Your purchase has been confirmed!</span>
	</div>
</div>

<input
	type="text"
	placeholder="Type here"
	class="input-bordered input-secondary input w-full max-w-xs"
/>

<div class="flex flex-col">
	<div class="form-control w-52">
		<label class="label cursor-pointer">
			<span class="label-text">Remember me</span>
			<input type="checkbox" class="toggle-primary toggle" checked />
		</label>
	</div>
	<div class="form-control w-52">
		<label class="label cursor-pointer">
			<span class="label-text">Remember me</span>
			<input type="checkbox" class="toggle-secondary toggle" checked />
		</label>
	</div>
	<div class="form-control w-52">
		<label class="label cursor-pointer">
			<span class="label-text">Remember me</span>
			<input type="checkbox" class="toggle-accent toggle" checked />
		</label>
	</div>
</div>

<div class="join">
	<input type="radio" name="options" aria-label="1" class="join-item btn" />
	<input type="radio" name="options" aria-label="2" class="join-item btn" checked />
	<input type="radio" name="options" aria-label="3" class="join-item btn" />
	<input type="radio" name="options" aria-label="4" class="join-item btn" />
</div>

<div class="join">
	<button class="btn-active btn">Button</button>
	<button class="join-item btn">Button</button>
	<button class="join-item btn">Button</button>
</div>

<select class="select-primary select w-full max-w-xs">
	<option disabled selected>What is the best TV show?</option>
	<option>Game of Thrones</option>
	<option>Lost</option>
	<option>Breaking Bad</option>
	<option>Walking Dead</option>
</select>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a class="btn-ghost btn text-xl normal-case">daisyUI</a>
	</div>
	<div class="flex-none">
		<div class="dropdown-end dropdown">
			<label tabindex="0" class="btn-ghost btn-circle btn">
				<div class="indicator">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
						/></svg
					>
					<span class="badge badge-sm indicator-item">8</span>
				</div>
			</label>
			<div
				tabindex="0"
				class="card dropdown-content card-compact mt-3 w-52 bg-base-100 shadow"
			>
				<div class="card-body">
					<span class="text-lg font-bold">8 Items</span>
					<span class="text-info">Subtotal: $999</span>
					<div class="card-actions">
						<button class="btn-primary btn-block btn">View cart</button>
					</div>
				</div>
			</div>
		</div>
		<div class="dropdown-end dropdown">
			<label tabindex="0" class="btn-ghost btn-circle avatar btn">
				<div class="w-10 rounded-full">
					<img src="https://placeimg.com/80/80/people" />
				</div>
			</label>
			<ul
				tabindex="0"
				class="menu-compact dropdown-content menu rounded-box mt-3 w-52 bg-base-100 p-2 shadow"
			>
				<li>
					<a class="justify-between">
						Profile
						<span class="badge">New</span>
					</a>
				</li>
				<li><a>Settings</a></li>
				<li><a>Logout</a></li>
			</ul>
		</div>
	</div>
</div>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content flex-col lg:flex-row">
		<img src="https://placeimg.com/260/400/arch" class="max-w-sm rounded-lg shadow-2xl" />
		<div>
			<h1 class="text-5xl font-bold">Box Office News!</h1>
			<p class="py-6"
				>Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
				exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p
			>
			<button class="btn-primary btn">Get Started</button>
		</div>
	</div>
</div>
