import { useEffect, useState } from "react";
import {
  hiddenSpinner,
  showSpinner,
} from "../../../util/util";
import { Link } from "react-router-dom";
import { Button, Image, Modal, Table, message } from "antd";
import { https } from "../../../config/axios";
// import { Product } from "../../../types/productType";
import PaginationPage from "../../../components/PaginationPage/PaginationPage";
import productService from "../../../services/productService";
import ProductListSkeleton from "../../../components/Skeleton/Admin/ProductListSkeleton";
import { Product } from "../../../types/products";

const ProductsList: React.FC = () => {
  const params = new URLSearchParams(location.search);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const limitPerPage = 10;
  const currentPage = params.get("page") ? Number(params.get("page")) : 1;
  const [productList, setProductList] = useState<Product[]>([]);

  const fetchData = async () => {
    showSpinner();
    try {
      const { data } = await productService.getAllProducts(limitPerPage, currentPage);
      setLoading(false);
      setProductList(data.results);
      setTotalProducts(data.totalResults);
      window.scrollTo(0, 0);
      hiddenSpinner();
    } catch (error) {
      hiddenSpinner();
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [location.search]);

  const handleDelete = async (id: string) => {
    showSpinner();
    try {
      const data = await https.delete(`/products/${id}`);
      if (data) {
        message.success(data.data.message);
        fetchData();
        hiddenSpinner();
      }
    } catch (error) {
      hiddenSpinner();
      console.log(error);
      message.error(error.response.data.message);
    }
  };

  const { confirm } = Modal;

  const showConfirm = (id: string) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa?',
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        console.log('Cancel');
      },
      maskClosable: true,
    });
  };

  // Define columns for the Table
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: Product, index: number) => ((currentPage - 1) * limitPerPage + (index + 1)),
    },
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (text: string) => <Image src={text} width={100} height={100} />,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tồn kho",
      dataIndex: "countInStock",
      key: "countInStock",
      sorter: (a: Product, b: Product) => a.countInStock - b.countInStock,
    },
    {
      title: "Lượt mua",
      dataIndex: "purchases",
      key: "purchases",
      sorter: (a: Product, b: Product) => a.purchases - b.purchases,
    },
    {
      title: "Lượt thích",
      dataIndex: "likes",
      key: "likes",
      sorter: (a: Product, b: Product) => a.likes - b.likes,
    },
    {
      title: "Đánh giá",
      dataIndex: "finalScoreReview",
      key: "finalScoreReview",
      sorter: (a: Product, b: Product) => a.finalScoreReview - b.finalScoreReview,
    },
    {
      title: "Giá thấp nhất",
      dataIndex: "minPrice",
      key: "minPrice",
      sorter: (a: Product, b: Product) => a.minPrice - b.minPrice,
    },
    {
      title: "Giá cao nhất",
      dataIndex: "maxPrice",
      key: "maxPrice",
      sorter: (a: Product, b: Product) => a.maxPrice - b.maxPrice,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (text: any, record: Product) => (
        <>
          <Link
            to={`/admin/products/${record.id}`}
            className="text-sm font-semibold text-yellow-500 hover:text-yellow-600"
          >
            Chi tiết
          </Link>
          <Button
            type="link"
            onClick={() => showConfirm(record.id)}
            className="text-sm font-semibold text-red-500 hover:text-red-600"
          >
            Xoá
          </Button>
        </>
      ),
    },
  ];




  return (
    <div className="">
      <div className="p-6 pb-0 mb-0 bg-white rounded-t-2xl">
        <Link
          to="/admin/products/add"
          className="text-white text-base font-semibold bg-green-500 py-2 px-2 rounded my-5 hover:bg-green-600"
        >
          <span>Thêm mới</span>
        </Link>
      </div>
      <div className="h-full p-8">
        <Table
          columns={columns}
          dataSource={productList}
          rowKey="id"
          pagination={false}
        />
        {/* )} */}
        <PaginationPage
          current={currentPage}
          total={totalProducts}
          pageSize={limitPerPage}
        />
      </div>
    </div>
  );
};

export default ProductsList;
