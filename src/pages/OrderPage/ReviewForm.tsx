// type Props = {};
import {
    Button,
    Form,
    Rate,
    Space,
    Upload,
    message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { https } from "../../config/axios";
import { hiddenSpinner, showSpinner } from "../../util/util";
import orderService from "../../services/orderSerivce";

const desc = ['Tệ', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Tuyệt vời'];

type Props = {
    orderId: string;
    setFormReviewValues: any;
};

const ReviewForm: React.FC<Props> = ({ orderId, setFormReviewValues }: Props) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [starValue, setStarValue] = useState(5);

    const [orderDetail, setOrderDetail] = useState<any>(null);

    const fetchOrderDetail = async () => {
        // showSpinner();
        if (orderId) {
            try {
                const res = await orderService.getOrderDetail(orderId);
                setOrderDetail(res.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                // hiddenSpinner();
            }
        }
    };

    useEffect(() => {
        fetchOrderDetail();
    }, []);




    const onFinish = (values: any) => {
        const postProduct = async () => {
            // console.log(values, 'values');
            setFormReviewValues(values);
            return;
            showSpinner();
            const attributeData: any = [];
            // console.log(attributeData, 'attributeData');
            // console.log('123')

            const listFiles = values.gallery;
            const thumbnail: any = values.thumbnail;


            const newArrayFiles = listFiles.map((file: any) => file.originFileObj);
            const thumbnailFile = thumbnail[0].originFileObj;

            const formData = new FormData();
            for (const file of newArrayFiles) {
                formData.append("images", file);
            }

            const formDataThumbnail = new FormData();
            formDataThumbnail.append("images", thumbnailFile);
            try {
                const { data: dataGallery } = await https.post("/images", formData);
                const urlGallery: { url: string; publicId: string }[] = dataGallery.data;

                const { data: dataThumbnail } = await https.post("/images", formDataThumbnail);
                const urlThumbnail: { url: string; publicId: string }[] = dataThumbnail.data;

                const data = {
                    name: values.name,
                    description: values.description,
                    gallery: urlGallery.map((image) => image.url),
                    thumbnail: urlThumbnail[0].url,
                    categories: values.categories,
                    attributes: attributeData,
                    video: "",
                };

                const res = await https.post("/products", data);
                if (res) {
                    message.success("Thêm sản phẩm thành công!");
                    navigate("/admin/products");
                    hiddenSpinner();
                }
            } catch (error) {
                hiddenSpinner();
                console.log(error);
                message.error(error.response.data.message);
            }
        };
        postProduct();
    };

    const onFinishFailed = (errorInfo: unknown) => {
        console.log("Failed:", errorInfo);
    };

    // const onCategoryChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    //   console.log('checked = ', checkedValues);
    //   selectedCategories = checkedValues;
    // };

    const onReset = () => {
        form.resetFields();
    };

    const handleStarChange = (value: any) => {
        console.log(value, 'value');
        form.setFieldsValue({ star: value });
        setStarValue(value);
        // console.log(starValue, 'starValue');
    };

    return (
        <div className="w-full mx-auto p-5">
            {/* <h3 className=" text-2xl text-slate-700 text-center mt-6 mb-3">
                Thêm mới
            </h3> */}
            {orderDetail?.productsOrder.map((product: any) => (
                <>
                    <div className="flex gap-2">
                        <div className="mb-5">
                            <img className="w-20 h-20 object-cover" src={product.imageProduct} alt={product.productName} />
                        </div>
                        <div>
                            <h3 className="text-lg uppercase">{product.productName}</h3>
                            <p className="normal-case text-[#757575]">
                                Phân loại hàng: <span className="">{product.attribute}</span>
                            </p>
                        </div>
                    </div>
                    <div className="border-[1px] border-gray-100 mb-2"></div>
                    <Form
                        form={form}
                        layout="vertical"
                        name="basic"
                        labelCol={{ span: 12 }}
                        wrapperCol={{ span: 24 }}
                        style={{}}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        requiredMark={false}
                    >
                        <div className="">
                            <div className="grid xl:grid-cols-2 xl:gap-10">
                                <div>
                                    {/*  */}
                                    <Form.Item
                                        label="Nhận xét"
                                        name="description"
                                        rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
                                    >
                                        <TextArea rows={4} placeholder="Hãy chia sẻ nhận xét cho sản phẩm này bạn nhé" />
                                    </Form.Item>

                                    <Form.Item
                                        name="star"
                                        label="Đánh giá"
                                        rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
                                        initialValue={starValue}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Rate className='' onChange={handleStarChange} defaultValue={5} />
                                            {starValue ? <span className="text-orange-400 text-[16px]">{desc[starValue - 1]}</span> : null}

                                        </div>
                                    </Form.Item>
                                </div>
                                <div>
                                    {/* thumbnail */}
                                    <Form.Item
                                        label="Thêm hình ảnh"
                                        name="thumbnail"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
                                        rules={[
                                            { required: true, message: "Vui lòng chọn file!" },
                                            {
                                                validator(_, fileList) {
                                                    if (fileList && fileList.length > 0) {
                                                        const file = fileList[0];
                                                        if (file.size > 1024 * 1024) {
                                                            return Promise.reject("File tối đa 1MB");
                                                        }
                                                        if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
                                                            return Promise.reject("File phải có định dạng png, jpg, jpeg!");
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
                                    >
                                        <Upload.Dragger
                                            listType="picture"
                                            beforeUpload={() => false}
                                            maxCount={1} // chỉ cho phép tải lên một file duy nhất
                                        >
                                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                                        </Upload.Dragger>
                                    </Form.Item>
                                    {/* video */}
                                    <Form.Item
                                        label="Thêm video"
                                        name="video"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
                                        rules={[
                                            { required: true, message: "Vui lòng chọn file!" },
                                            {
                                                validator(_, fileList) {
                                                    if (fileList && fileList.length > 0) {
                                                        const file = fileList[0];
                                                        if (file.size > 1024 * 1024) {
                                                            return Promise.reject("File tối đa 1MB");
                                                        }
                                                        if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
                                                            return Promise.reject("File phải có định dạng png, jpg, jpeg!");
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
                                    >
                                        <Upload.Dragger
                                            listType="picture"
                                            beforeUpload={() => false}
                                            maxCount={1} // chỉ cho phép tải lên một file duy nhất
                                        >
                                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                                        </Upload.Dragger>
                                    </Form.Item>
                                </div>


                            </div>
                            <Form.Item>
                                <Space>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="text-white bg-green-500"
                                    >
                                        Đánh giá
                                    </Button>
                                    <Button htmlType="button" onClick={onReset}>
                                        Reset
                                    </Button>
                                </Space>
                            </Form.Item>
                        </div>
                    </Form>
                </>

            ))}
        </div>
    );
};

export default ReviewForm;
