<script>
	let TrackingNumber = "";
	let TokenNumber = "";
	let DeliveryStatus = -1;

	function shipCells() {
		alert("shipping cells");
		let path = `createTrackingNumber/${TokenNumber}/${TrackingNumber}`;
		httpRequest(path);
	}

	function updateDeliveryStatus() {
		alert("Updating Dlivery Status");
		let path = `settokenStatus/${TokenNumber}/${DeliveryStatus}`;
		httpRequest(path);
	}

	function httpRequest(path) {
		fetch(`http://localhost:8888/${path}`, {
			method: "GET",
			headers: {
				'Access-Control-Allow-Origin': '*',
				// like application/json or text/xml
			}
		});
	}
</script>

<main>
	<h1>Shipping Test App</h1>
	<p>This is a test shipping app</p>

	<div>
		<h3>Ship Cells</h3>
		<input
			required={true}
			bind:value={TrackingNumber}
			placeholder="TrackingNumber"
		/>
		<input
			required={true}
			bind:value={TokenNumber}
			placeholder="Token Number"
		/>
		<br />
		<button on:click={shipCells}>Ship Cells</button>
		<h5>{TokenNumber} has been shipped TN= {TrackingNumber}</h5>
	</div>

	<div>
		<h3>Change Delivery Status</h3>
		<p>
			Delivery Statuses: 0 = 'AT Origin', 1 = 'In Transit', 2 =
			'Delivered'
		</p>
		<input
			required={true}
			bind:value={TokenNumber}
			placeholder="Token Number"
		/>
		<input
			required={true}
			bind:value={DeliveryStatus}
			placeholder="Delivery Status - 0,1,2"
		/>
		<br />
		<button on:click={updateDeliveryStatus}>Update Delivery Status</button>
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
