<script>
	let shipment = {service_code:"ups_ground",ship_to:{name:"",address_line1:"",city_locality:"",state_province:"",postal_code:"",country_code:"",address_residential_indicator:""},ship_from:{name:"",phone:"",company_name:"",address_line1:"",city_locality:"",state_province:"",postal_code:"",country_code:"",address_residential_indicator:""},packages:[{dimensions:{height:6,width:12,length:24,unit:"inch"},weight:{value:20,unit:"ounce"}}]};
	let TrackingNumber = "";
	let TokenNumber = "";
	let toName = "";
	let toadline1 = ""
	let tocity = ""
	let tostate = ""
	let topostal = ""
	let tocountry = ""
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
		<div>
			<h4>Ship To Address</h4>
			<input style="width: 150px;"
			required={true}
			bind:value={shipment.ship_to.name}
			placeholder="Postal"
			/>
			<input
			required={true}
			bind:value={tocity}
			placeholder="City"
			/>
			<input
			style="width: 45px;"
			required={true}
			bind:value={tocountry}
			placeholder="Country"
			/>
			<br>
			<input style="width: 400px;"
			required={true}
			bind:value={toadline1}
			placeholder="Address"
			/>
			<br>
			<input style="width: 400px;"
			required={true}
			bind:value={tostate}
			placeholder="State"
			/>

			<br>
			<input style="width: 400px;"
			required={true}
			bind:value={toName}
			placeholder="name"
			/>


		</div>
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
