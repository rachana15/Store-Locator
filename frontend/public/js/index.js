function initMap() {}
let map;
var infowindow;
var markers = [];
function initMap() {
  let losAngeles = { lat: 34.06338, lng: -118.35808 };
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: losAngeles,
    zoom: 11,
    styles: [
      {
        featureType: "all",
        elementType: "geometry",
        stylers: [
          {
            color: "#ebe3cd"
          }
        ]
      },
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#523735"
          }
        ]
      },
      {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#f5f1e6"
          }
        ]
      },
      {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#c9b2a6"
          }
        ]
      },
      {
        featureType: "administrative.land_parcel",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#dcd2be"
          }
        ]
      },
      {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#ae9e90"
          }
        ]
      },
      {
        featureType: "landscape.natural",
        elementType: "geometry",
        stylers: [
          {
            color: "#dfd2ae"
          }
        ]
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
          {
            color: "#dfd2ae"
          }
        ]
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#93817c"
          }
        ]
      },
      {
        featureType: "poi.park",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#a5b076"
          }
        ]
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#447530"
          }
        ]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            color: "#f5f1e6"
          }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
          {
            color: "#f8c967"
          }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#e9bc62"
          }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "labels",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "road.highway.controlled_access",
        elementType: "geometry",
        stylers: [
          {
            color: "#e98d58"
          }
        ]
      },
      {
        featureType: "road.highway.controlled_access",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#db8555"
          }
        ]
      },
      {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
          {
            color: "#fdfcf8"
          }
        ]
      },
      {
        featureType: "road.arterial",
        elementType: "labels",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "road.local",
        elementType: "all",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#806b63"
          }
        ]
      },
      {
        featureType: "transit.line",
        elementType: "geometry",
        stylers: [
          {
            color: "#dfd2ae"
          }
        ]
      },
      {
        featureType: "transit.line",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#8f7d77"
          }
        ]
      },
      {
        featureType: "transit.line",
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#ebe3cd"
          }
        ]
      },
      {
        featureType: "transit.station",
        elementType: "geometry",
        stylers: [
          {
            color: "#dfd2ae"
          }
        ]
      },
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#b9d3c2"
          }
        ]
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#92998d"
          }
        ]
      }
    ]
  });
  // getStores();
  createMarker();
}

const createMarker = (
  latlng,
  name,
  address,
  storeNumber,
  openStatusText,
  phone
) => {
  // var myLatlng = new google.maps.LatLng(34.06338, -118.35808);
  var marker = new google.maps.Marker({
    position: latlng,
    label: `${storeNumber}`,
    map: map
  });
  markers.push(marker);
  let contentInfo = `
  <div class="store-info-window">
  <div class = "store-info-name"> ${name}</div>
  <div class = "store-info-open-status"> ${openStatusText} </div>
  <div class = "store-info-address"> 
  <div class="icon"> <i class="fas fa-location-arrow"></i> </div>
  <span> ${address} </span> </div>
  <div class = "store-info-phone"> 
  <div class="icon"> <i class="fas fa-phone"></i> </div>
  <span>  <a href="tel:${phone}"> ${phone} </a> </span> </div>
  </div>
  `;

  google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(contentInfo);
    infowindow.open(map, marker);
  });
};

const getStores = () => {
  const zipCode = document.getElementById("zip-code").value;
  if (!zipCode) {
    return;
  }
  const API_URL = "http://localhost:3000/api/stores";
  const fullUrl = `${API_URL}?zip_code=${zipCode}`;
  fetch(fullUrl)
    .then(response => {
      if (response.status == 200) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then(data => {
      // console.log(data);
      if (data.length > 0) {
        clearLocations();
        setStoresList(data);
        searchlocationsNear(data);
        setOnCLickListener();
      } else {
        clearLocations();
        noStoresFound();
      }
    });
};

const searchlocationsNear = stores => {
  let bounds = new google.maps.LatLngBounds();
  stores.map((store, index) => {
    let latlng = new google.maps.LatLng(
      store.location.coordinates[1],
      store.location.coordinates[0]
    );
    let name = store.storeName;
    let address = store.addressLine[0];
    let openStatusText = store.openStatusText;
    let phone = store.phoneNumber;
    bounds.extend(latlng);
    createMarker(latlng, name, address, index + 1, openStatusText, phone);
  });
  map.fitBounds(bounds);
};

const setStoresList = stores => {
  let listDisplay = "";
  stores.map((store, index) => {
    listDisplay += `<div class="store_container">
  <div class="store_container_background">
    <div class="store_info_container">
      <div class="store_address">
        <span>
          ${store.addressLine[0]}
        </span>
        <span>
          ${store.addressLine[1]}
        </span>
      </div>
      <div class="store_phoneNumber">${store.phoneNumber}</div>
    </div>
    <div class="store_number_container">
      <div class="store_number">${index + 1}</div>
    </div>
  </div>
</div>`;
  });
  console.log(listDisplay);
  document.querySelector(".stores_list").innerHTML = listDisplay;
};

const setOnCLickListener = () => {
  let storeElements = document.querySelectorAll(".store_container");
  console.log(markers[1]);
  storeElements.forEach((elem, index) => {
    elem.addEventListener("click", () => {
      google.maps.event.trigger(markers[index + 1], "click");
    });
  });
};

const clearLocations = () => {
  infowindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
};

const onEnter = e => {
  if (e.key == "Enter") {
    getStores();
  }
};

const noStoresFound = () => {
  const html = `
  <div class = "no_stores_found"> No Stores Found</div>
  `;
  document.querySelector(".stores_list").innerHTML = html;
};

const clearInput = () => {
  document.getElementById("zip-code").value = "";
};
