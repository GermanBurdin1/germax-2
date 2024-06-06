<?php
class SqlRequests
{
	function returnRequestForGetModelByName()
	{
		return "
		SELECT
			model.name AS model_name,
			model.description AS model_description,
			model.photo AS model_photo,
			good.id_status,
			statu.name AS status_name,
			model.id_type AS model_id_type,
			typ.name AS model_type_name,
			model.id_brand AS model_id_brand,
			brand.name AS model_brand_name
	FROM
			good
	JOIN
			status statu ON good.id_status = statu.id_status
	JOIN
			model ON good.id_model = model.id_model
	JOIN
			type typ ON model.id_type = typ.id_type
	JOIN
			brand ON model.id_brand = brand.id_brand
	WHERE
			statu.name = 'available'
			AND model.name LIKE :modelName;
	";
	}

	function returnRequestForGetLaptopsByCategories()
	{
		return "
			SELECT
			model.id_model,
			model.name AS model_name,
			model.description AS model_description,
			model.photo AS model_photo,
			good.id_status,
			statu.name AS status_name,
			model.id_type AS model_id_type,
			typ.name AS model_type_name,
			model.id_brand AS model_id_brand,
			brand.name AS model_brand_name
		FROM
			good
		JOIN
			status statu ON good.id_status = statu.id_status
		JOIN
			model ON good.id_model = model.id_model
		JOIN
			type typ ON model.id_type = typ.id_type
		JOIN
			brand ON model.id_brand = brand.id_brand
		WHERE
			statu.name = 'available'
			AND model.id_type = 1;
		";
	}

	function returnRequestForGetSmartphonesByCategories()
	{
		return "SELECT
			good.id_good,
			good.serial_number,
			good.id_model,
			model.name AS model_name,
			model.description AS model_description,
			model.photo AS model_photo,
			good.id_status,
			statu.name AS status_name,
			model.id_type AS model_id_type,
			typ.name AS model_type_name,
			model.id_brand AS model_id_brand,
			brand.name AS model_brand_name
	FROM
		good
	JOIN
		status statu ON good.id_status = statu.id_status
	JOIN
		model ON good.id_model = model.id_model
	JOIN
		type typ ON model.id_type = typ.id_type
	JOIN
		brand ON model.id_brand = brand.id_brand
	WHERE
		statu.name = 'available'
		AND model.id_type = 3;";
	}

	function returnRequestForGetTabletsByCategories()
	{
		return "SELECT
		model.id_model,
		model.name AS model_name,
		model.description AS model_description,
		model.photo AS model_photo,
		good.id_status,
		statu.name AS status_name,
		model.id_type AS model_id_type,
		typ.name AS model_type_name,
		model.id_brand AS model_id_brand,
		brand.name AS model_brand_name
	FROM
		good
	JOIN
		status statu ON good.id_status = statu.id_status
	JOIN
		model ON good.id_model = model.id_model
	JOIN
		type typ ON model.id_type = typ.id_type
	JOIN
		brand ON model.id_brand = brand.id_brand
	WHERE
		statu.name = 'available'
		AND model.id_type = 5;";
	}

	function returnRequestForGetVR_headsetsByCategories()
	{
		return "SELECT
		model.id_model,
		model.name AS model_name,
		model.description AS model_description,
		model.photo AS model_photo,
		good.id_status,
		statu.name AS status_name,
		model.id_type AS model_id_type,
		typ.name AS model_type_name,
		model.id_brand AS model_id_brand,
		brand.name AS model_brand_name
	FROM
		good
	JOIN
		status statu ON good.id_status = statu.id_status
	JOIN
		model ON good.id_model = model.id_model
	JOIN
		type typ ON model.id_type = typ.id_type
	JOIN
		brand ON model.id_brand = brand.id_brand
	WHERE
		statu.name = 'available'
		AND model.id_type = 6;";
	}


}
