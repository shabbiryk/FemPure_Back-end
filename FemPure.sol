// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract FemPure {
    // Structs
    struct User {
        string pinCode;
        string residenceAddress;
    }

    struct Partner {
        string[] pinCodes;
        uint256 lastOrderID;
        bool approved;
        bool InTransit;
    }

    struct Product {
        string name;
        string description;
        uint256 priceInWei;
    }

    struct OrderData {
        uint256 orderInitiationTime;
        uint256[] productIDs;
        uint256[] supplyMap;
        bool partnerAssigned;
        bool orderDeliveredByPartner;
        bool orderReceivedByUser;
        bool orderCancelled;
        uint256 otp;
    }

    // Events
    event OrderAssignedToPartner(address indexed _user, address indexed _partner, uint256 indexed _orderId);
    event OrderCancelled(address indexed _partner, uint256 indexed _orderId);
    event NewOrder(string _pincode);
    event OrderDeliveredByPartner(address indexed _user, uint256 indexed _orderId);
    event newProductsAddedToLocation(string _pincode);
    event ProductsRemovedFromLocation(string _pincode);
    event NewPartnerRegistered();

    // Modifiers
    modifier onlyOwner {
        require(msg.sender == owner, "Only Owner");
        _;
    }

    modifier notPaused {
        require(contractPaused == false, "Contract is Paused");
        _;
    }

    modifier OnlyPartner {
        require(partnerIDtoPartner[msg.sender].pinCodes.length > 0, "Not a Registered Partner");
        _;
    }

    modifier OnlyApprovedPartner {
        require(partnerIDtoPartner[msg.sender].pinCodes.length > 0, "Not a Registered Partner");
        require(partnerIDtoPartner[msg.sender].approved, "Not an Approved Partner");
        _;
    }

    modifier OnlyUser {
        require(!StringCompare(userIDtoUser[msg.sender].pinCode, ""), "Not a Registered User");
        _;
    }

    // State variables
    address public owner;
    uint256 public orderNum;
    uint256 public productNum;
    bool public contractPaused;
    uint256 public logisticsCost;
    string public productMetadataBaseURI;

    // Constructor
    constructor(uint256 _logisticsCostInWei, string memory _productMetadataBaseURI) {
        owner = msg.sender;
        orderNum = 1;
        productNum = 0;
        contractPaused = false;
        logisticsCost = _logisticsCostInWei;
        productMetadataBaseURI = _productMetadataBaseURI;
    }

    // Mapping and Arrays
    mapping(string => uint256[]) public pincodeToAvailableProductIDs;
    string[] public availableLocations;
    mapping(uint256 => Product) public productIDtoProduct;
    address[] private registeredUsers;
    address[] private registeredPartners;
    mapping(address => User) private userIDtoUser;
    mapping(address => Partner) private partnerIDtoPartner;
    mapping(uint256 => OrderData) private orderIDtoOrderData;
    mapping(uint256 => address) private orderIDtoUserID;
    mapping(uint256 => address) private orderIDtoPartnerID;

    // Functions

    // Registration and User Functions
    function registerPartner(string[] memory pincodes) external notPaused {
        require(partnerIDtoPartner[msg.sender].pinCodes.length == 0, "Partner already Registered");
        require(pincodes.length > 0, "pincode not provided");
        for (uint256 i = 0; i < pincodes.length; i++) {
            require(!StringCompare(pincodes[i], ""), "Pincode cannot be blank");
        }

        partnerIDtoPartner[msg.sender] = Partner(pincodes, 0, false, false);
        registeredPartners.push(msg.sender);

        emit NewPartnerRegistered();
    }

    function isRegisteredPartner() external view returns (bool) {
        return partnerIDtoPartner[msg.sender].pinCodes.length > 0;
    }

    function registerUser(string memory _pincode, string memory _residenceAddress) external notPaused {
        require(StringCompare(userIDtoUser[msg.sender].pinCode, ""), "Already a Registered User");
        require(!StringCompare(_pincode, ""), "pincode not provided");
        require(!StringCompare(_residenceAddress, ""), "residence Address not provided");

        userIDtoUser[msg.sender] = User(_pincode, _residenceAddress);
        registeredUsers.push(msg.sender);
    }

    function isRegisteredUser() external view returns (bool) {
        return !StringCompare(userIDtoUser[msg.sender].pinCode, "");
    }

    function getUserPincode() external OnlyUser view returns (string memory) {
        return userIDtoUser[msg.sender].pinCode;
    }

    // Product Management Functions
    function addNewProduct(string memory productName, string memory productDescription, uint256 productPriceInWei) external onlyOwner {
        require(!StringCompare(productName, ""), "product name cannot be empty");
        require(productPriceInWei > 0, "productPrice cannot be zero");
        productIDtoProduct[productNum] = Product(productName, productDescription, productPriceInWei);
        productNum++;
    }

    function addProductstoLocation(string memory _pincode, uint256[] memory productIDs) external onlyOwner {
        for (uint256 i = 0; i < productIDs.length; i++) {
            require(!StringCompare(productIDtoProduct[productIDs[i]].name, ""), "Some product IDs are undefined");
        }
        require(productIDs.length > 0, "No product ID provided");
        require(!StringCompare(_pincode, ""), "pincode cannot be empty");
        uint256[] memory presentproductIDs = pincodeToAvailableProductIDs[_pincode];
        if (presentproductIDs.length > 0) {
            for (uint256 i = 0; i < productIDs.length; i++) {
                bool ispresent = false;
                for (uint256 j = 0; j < presentproductIDs.length; j++) {
                    if (productIDs[i] == presentproductIDs[j]) {
                        ispresent = true;
                        break;
                    }
                }
                if (!ispresent) {
                    bool valueAdded = false;
                    for (uint256 j = 0; j < pincodeToAvailableProductIDs[_pincode].length; j++) {
                        if (pincodeToAvailableProductIDs[_pincode][j] == productIDs[i]) {
                            valueAdded = true;
                            break;
                        }
                    }
                    if (!valueAdded)
                        pincodeToAvailableProductIDs[_pincode].push(productIDs[i]);
                }
            }
        } else {
            for (uint256 i = 0; i < productIDs.length; i++) {
                bool valueAdded = false;
                for (uint256 j = 0; j < pincodeToAvailableProductIDs[_pincode].length; j++) {
                    if (pincodeToAvailableProductIDs[_pincode][j] == productIDs[i]) {
                        valueAdded = true;
                        break;
                    }
                }
                if (!valueAdded)
                    pincodeToAvailableProductIDs[_pincode].push(productIDs[i]);
            }
            availableLocations.push(_pincode);
        }

        emit newProductsAddedToLocation(_pincode);
    }

    function removeProductsFromLocation(string memory _pincode, uint256[] memory productIDs) external onlyOwner {
        for (uint256 i = 0; i < productIDs.length; i++) {
            require(!StringCompare(productIDtoProduct[productIDs[i]].name, ""), "Some product IDs are undefined");
        }
        require(productIDs.length > 0, "No product ID provided");
        require(!StringCompare(_pincode, ""), "pincode cannot be empty");
        uint256[] memory presentproductIDs = pincodeToAvailableProductIDs[_pincode];
        require(presentproductIDs.length > 0, "pincode not present");
        uint256 indexToRemoveSize = 0;
        for (uint256 i = 0; i < productIDs.length; i++) {
            for (uint256 j = 0; j < presentproductIDs.length; j++) {
                if (productIDs[i] == presentproductIDs[j]) {
                    indexToRemoveSize++;
                    break;
                }
            }
        }

        uint256[] memory indexToRemove = new uint256[](indexToRemoveSize);
        uint256 iterIndexToRemove = 0;

        for (uint256 i = 0; i < productIDs.length; i++) {
            for (uint256 j = 0; j < presentproductIDs.length; j++) {
                if (productIDs[i] == presentproductIDs[j]) {
                    bool indexAdded = false;
                    for (uint256 k = 0; k < iterIndexToRemove; k++) {
                        if (indexToRemove[k] == j) {
                            indexAdded = true;
                            break;
                        }
                    }
                    if (!indexAdded) {
                        indexToRemove[iterIndexToRemove] = j;
                        iterIndexToRemove++;
                    }
                    break;
                }
            }
        }

        for (uint256 i = 0; i < iterIndexToRemove; i++) {
            for (uint256 j = indexToRemove[i]; j < pincodeToAvailableProductIDs[_pincode].length - 1; j++) {
                pincodeToAvailableProductIDs[_pincode][j] = pincodeToAvailableProductIDs[_pincode][j + 1];
            }
            for (uint256 k = i + 1; k < iterIndexToRemove; k++) {
                if (indexToRemove[k] > indexToRemove[i])
                    indexToRemove[k]--;
            }
            pincodeToAvailableProductIDs[_pincode].pop();
        }

        if (pincodeToAvailableProductIDs[_pincode].length == 0) {
            for (uint256 i = 0; i < availableLocations.length; i++) {
                if (StringCompare(availableLocations[i], _pincode)) {
                    availableLocations[i] = availableLocations[availableLocations.length - 1];
                    availableLocations.pop();
                }
            }
        }

        emit ProductsRemovedFromLocation(_pincode);
    }

    // Partner Management Functions
    function getUnapprovedPartners() external onlyOwner view returns (address[] memory, Partner[] memory) {
        uint256 _unapprovedPartnerNum = 0;
        for (uint256 i = 0; i < registeredPartners.length; i++) {
            if (!partnerIDtoPartner[registeredPartners[i]].approved)
                _unapprovedPartnerNum++;
        }
        address[] memory addresses = new address[](_unapprovedPartnerNum);
        Partner[] memory partners = new Partner[](_unapprovedPartnerNum);
        uint iterPartners = 0;
        for (uint256 i = 0; i < registeredPartners.length; i++) {
            if (!partnerIDtoPartner[registeredPartners[i]].approved) {
                addresses[iterPartners] = registeredPartners[i];
                partners[iterPartners] = partnerIDtoPartner[registeredPartners[i]];
                iterPartners++;
            }
        }

        return (addresses, partners);
    }

    function approvePartner(address partner) external onlyOwner {
        Partner memory _partner = partnerIDtoPartner[partner];
        require(_partner.pinCodes.length > 0, "Not a Registered Partner");
        require(!_partner.approved, "Already Approved Partner");

        partnerIDtoPartner[partner].approved = true;
    }

    function checkApprovalStatus() external OnlyPartner view returns (bool) {
        return partnerIDtoPartner[msg.sender].approved;
    }

    // Order Management Functions
    function placeOrder(uint256[] memory _productIDs, uint256[] memory _supplyMap) external payable OnlyUser notPaused {
        require(_productIDs.length == _supplyMap.length, "Number of productID and supply should be same");
        require(calculateTotalOrderItems(_productIDs, _supplyMap) > 0, "Product Input is empty");
        string memory _pincode = userIDtoUser[msg.sender].pinCode;
        require(checkIfRightProducts(_productIDs, _pincode), "Some Products are not Available");
        uint256 _totalCost = this.calculateOrderCost(_productIDs, _supplyMap);
        require(msg.value > _totalCost + logisticsCost, "Not enough balance");
        uint256 _orderNum = orderNum;
        orderIDtoOrderData[_orderNum] = OrderData(block.timestamp, _productIDs, _supplyMap, false, false, false, false, generateOTP(_productIDs, _supplyMap) % 10000);
        orderIDtoUserID[_orderNum] = msg.sender;

        emit NewOrder(_pincode);

        address _partner = this.findAvailablePartner(_pincode);
        require(_partner != address(0), "No Partner available for Delivery");
        assignOrderToAPartner(_orderNum, _pincode, _partner);

        orderNum++;
    }

    function markOrderDelivered() external OnlyApprovedPartner notPaused {
        Partner memory partner = partnerIDtoPartner[msg.sender];
        require(partner.InTransit, "Not Active Orders");
        orderIDtoOrderData[partner.lastOrderID].orderDeliveredByPartner = true;
        partnerIDtoPartner[msg.sender].InTransit = false;

        emit OrderDeliveredByPartner(orderIDtoUserID[partner.lastOrderID], partner.lastOrderID);
    }

    function verifyOrderDelivery(uint256 _orderId, uint256 _otp) external OnlyUser notPaused {
        require(orderIDtoUserID[_orderId] == msg.sender, "This is not your order");
        OrderData memory order = orderIDtoOrderData[_orderId];
        require(order.orderDeliveredByPartner && (!order.orderReceivedByUser) && (!order.orderCancelled), "Order is not delivered or has Already been received or has been cancelled");
        require(order.otp == _otp, "OTP does not match");
        orderIDtoOrderData[_orderId].orderReceivedByUser = true;
    }

    function cancelOrderAndRefund(uint256 _orderId) external OnlyUser notPaused {
        require(orderIDtoUserID[_orderId] == msg.sender, "This is not your order");
        OrderData memory order = orderIDtoOrderData[_orderId];
        require((!order.orderDeliveredByPartner) && (!order.orderCancelled), "Order has been delivered or already cancelled");
        orderIDtoOrderData[_orderId].orderCancelled = true;
        partnerIDtoPartner[orderIDtoPartnerID[_orderId]].InTransit = false;
        address payable user = payable(msg.sender);
        uint256 _totalCost = this.calculateOrderCost(order.productIDs, order.supplyMap);
        if (order.partnerAssigned) {
            uint256 _logisticsCost = logisticsCost;
            if (_totalCost - _logisticsCost > 0) {
                (bool success, bytes memory returnData) = user.call{value: _totalCost - _logisticsCost}("");
                require(success, string(returnData));
            }
        } else {
            (bool success, bytes memory returnData) = user.call{value: _totalCost}("");
            require(success, string(returnData));
        }

        emit OrderCancelled(orderIDtoPartnerID[_orderId], _orderId);
    }

    function assignOrderToAPartner(uint256 _orderNum, string memory _pincode, address partner) internal notPaused {
        require(partnerIDtoPartner[partner].approved, "Partner is not Approved");
        bool pincodePresent = false;
        for (uint256 i = 0; i < partnerIDtoPartner[partner].pinCodes.length; i++) {
            if (StringCompare(partnerIDtoPartner[partner].pinCodes[i], _pincode)) {
                pincodePresent = true;
                break;
            }
        }

        require(pincodePresent, "Partner cannot deliver to this pincode");
        partnerIDtoPartner[partner].lastOrderID = _orderNum;
        partnerIDtoPartner[partner].InTransit = true;
        orderIDtoPartnerID[_orderNum] = partner;
        orderIDtoOrderData[_orderNum].partnerAssigned = true;

        emit OrderAssignedToPartner(orderIDtoUserID[_orderNum], partner, _orderNum);
    }

    function getPendingOrderPartner() external OnlyApprovedPartner view returns (OrderData memory, uint256) {
        require(partnerIDtoPartner[msg.sender].InTransit, "No Pending Orders");
        return (orderIDtoOrderData[partnerIDtoPartner[msg.sender].lastOrderID], partnerIDtoPartner[msg.sender].lastOrderID);
    }

    function getDeliveryAddressPartner() external OnlyApprovedPartner view returns (string memory, string memory) {
        require(partnerIDtoPartner[msg.sender].InTransit, "No Pending Orders");
        return (userIDtoUser[orderIDtoUserID[partnerIDtoPartner[msg.sender].lastOrderID]].residenceAddress, userIDtoUser[orderIDtoUserID[partnerIDtoPartner[msg.sender].lastOrderID]].pinCode);
    }

    function getCompletedOrdersPartner() external OnlyApprovedPartner view returns (OrderData[] memory, uint256[] memory) {
        uint256 completedOrdersNum = 0;
        for (uint256 i = 0; i < orderNum; i++) {
            if (orderIDtoPartnerID[i] == msg.sender && orderIDtoOrderData[i].orderDeliveredByPartner)
                completedOrdersNum++;
        }
        OrderData[] memory orders = new OrderData[](completedOrdersNum);
        uint256[] memory orderIDs = new uint256[](completedOrdersNum);
        uint256 iterOrders = 0;
        for (uint256 i = 0; i < orderNum; i++) {
            if (orderIDtoPartnerID[i] == msg.sender && orderIDtoOrderData[i].orderDeliveredByPartner) {
                orders[iterOrders] = orderIDtoOrderData[i];
                orderIDs[iterOrders] = i;
                iterOrders++;
            }
        }

        return (orders, orderIDs);
    }

    function getCancelledOrdersPartner() external OnlyApprovedPartner view returns (OrderData[] memory, uint256[] memory) {
        uint256 cancelledOrdersNum = 0;
        for (uint256 i = 0; i < orderNum; i++) {
            if (orderIDtoPartnerID[i] == msg.sender && orderIDtoOrderData[i].orderCancelled)
                cancelledOrdersNum++;
        }
        OrderData[] memory orders = new OrderData[](cancelledOrdersNum);
        uint256[] memory orderIDs = new uint256[](cancelledOrdersNum);
        uint256 iterOrders = 0;
        for (uint256 i = 0; i < orderNum; i++) {
            if (orderIDtoPartnerID[i] == msg.sender && orderIDtoOrderData[i].orderCancelled) {
                orders[iterOrders] = orderIDtoOrderData[i];
                orderIDs[iterOrders] = i;
                iterOrders++;
            }
        }

        return (orders, orderIDs);
    }

    function getPendingOrdersUser() external OnlyUser view returns (OrderData[] memory, uint256[] memory) {
        uint256 pendingOrdersNum = 0;
        for (uint256 i = 0; i < orderNum; i++) {
            if (orderIDtoUserID[i] == msg.sender && (!orderIDtoOrderData[i].orderReceivedByUser) && (!orderIDtoOrderData[i].orderCancelled))
                pendingOrdersNum++;
        }
        OrderData[] memory orders = new OrderData[](pendingOrdersNum);
        uint256[] memory orderIDs = new uint256[](pendingOrdersNum);
        uint256 iterOrders = 0;
        for (uint256 i = 0; i < orderNum; i++) {
            if (orderIDtoUserID[i] == msg.sender && (!orderIDtoOrderData[i].orderReceivedByUser) && (!orderIDtoOrderData[i].orderCancelled)) {
                orders[iterOrders] = orderIDtoOrderData[i];
                orderIDs[iterOrders] = i;
                iterOrders++;
            }
        }

        return (orders, orderIDs);
    }

    function getCompletedOrdersUser() external OnlyUser view returns (OrderData[] memory, uint256[] memory) {
        uint256 completedOrdersNum = 0;
        for (uint256 i = 0; i < orderNum; i++) {
            if (orderIDtoUserID[i] == msg.sender && orderIDtoOrderData[i].orderReceivedByUser)
                completedOrdersNum++;
        }
        OrderData[] memory orders = new OrderData[](completedOrdersNum);
        uint256[] memory orderIDs = new uint256[](completedOrdersNum);
        uint256 iterOrders = 0;
        for (uint256 i = 0; i < orderNum; i++) {
            if (orderIDtoUserID[i] == msg.sender && orderIDtoOrderData[i].orderReceivedByUser) {
                orders[iterOrders] = orderIDtoOrderData[i];
                orderIDs[iterOrders] = i;
                iterOrders++;
            }
        }

        return (orders, orderIDs);
    }

    function getCancelledOrdersUser() external OnlyUser view returns (OrderData[] memory, uint256[] memory) {
        uint256 cancelledOrdersNum = 0;
        for (uint256 i = 0; i < orderNum; i++) {
            if (orderIDtoUserID[i] == msg.sender && orderIDtoOrderData[i].orderCancelled)
                cancelledOrdersNum++;
        }
        OrderData[] memory orders = new OrderData[](cancelledOrdersNum);
        uint256[] memory orderIDs = new uint256[](cancelledOrdersNum);
        uint256 iterOrders = 0;
        for (uint256 i = 0; i < orderNum; i++) {
            if (orderIDtoUserID[i] == msg.sender && orderIDtoOrderData[i].orderCancelled) {
                orders[iterOrders] = orderIDtoOrderData[i];
                orderIDs[iterOrders] = i;
                iterOrders++;
            }
        }

        return (orders, orderIDs);
    }

    // Helper Functions
    function calculateTotalOrderItems(uint256[] memory _productIDs, uint256[] memory _supplyMap) internal pure returns (uint256) {
        uint256 totalItems = 0;
        for (uint256 i = 0; i < _supplyMap.length; i++) {
            totalItems += _supplyMap[i];
        }
        return totalItems;
    }

    function checkIfRightProducts(uint256[] memory _productIDs, string memory _pincode) internal view returns (bool) {
        for (uint256 i = 0; i < _productIDs.length; i++) {
            bool found = false;
            for (uint256 j = 0; j < pincodeToAvailableProductIDs[_pincode].length; j++) {
                if (_productIDs[i] == pincodeToAvailableProductIDs[_pincode][j]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }

    function calculateOrderCost(uint256[] memory _productIDs, uint256[] memory _supplyMap) internal view returns (uint256) {
        uint256 totalCost = 0;
        for (uint256 i = 0; i < _productIDs.length; i++) {
            totalCost += productIDtoProduct[_productIDs[i]].priceInWei * _supplyMap[i];
        }
        return totalCost;
    }

    function generateOTP(uint256[] memory _productIDs, uint256[] memory _supplyMap) internal pure returns (uint256) {
        uint256 otp = 0;
        for (uint256 i = 0; i < _productIDs.length; i++) {
            otp += _productIDs[i] * _supplyMap[i];
        }
        return otp;
    }

    function findAvailablePartner(string memory _pincode) internal view returns (address) {
        for (uint256 i = 0; i < registeredPartners.length; i++) {
            if (partnerIDtoPartner[registeredPartners[i]].approved) {
                for (uint256 j = 0; j < partnerIDtoPartner[registeredPartners[i]].pinCodes.length; j++) {
                    if (StringCompare(partnerIDtoPartner[registeredPartners[i]].pinCodes[j], _pincode)) {
                        if (!partnerIDtoPartner[registeredPartners[i]].InTransit) {
                            return registeredPartners[i];
                        }
                    }
                }
            }
        }
        return address(0);
    }

    function StringCompare(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    // Pause and Unpause Functions
    function pauseContract() external onlyOwner {
        contractPaused = true;
    }

    function unpauseContract() external onlyOwner {
        contractPaused = false;
    }

    // Withdraw Functions
    function withdrawBalance() external onlyOwner {
        address payable ownerPayable = payable(owner);
        ownerPayable.transfer(address(this).balance);
    }

    // Fallback function to receive ether
    receive() external payable {}

    // Other Owner Only Functions
    function changeLogisticsCost(uint256 _logisticsCostInWei) external onlyOwner {
        logisticsCost = _logisticsCostInWei;
    }

    function changeProductMetadataBaseURI(string memory _baseURI) external onlyOwner {
        productMetadataBaseURI = _baseURI;
    }
}
