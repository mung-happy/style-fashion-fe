import React, { useEffect, useState } from 'react'
import { Blog, User } from '../../types/blog'
import { useParams } from 'react-router-dom'
import { hiddenSpinner, showSpinner } from '../../util/util'
import DOMPurify from 'dompurify'
import { https } from '../../config/axios'

type Props = {}


const DetailBlog = (props: Props) => {
  const [blog, setBlog] = useState<Blog>()
  const [user, setUser] = useState<User>();
  const { id } = useParams();

  const fetchBlogDetail = async() =>{
    showSpinner();
    try {
      const response = await https.get(`/blogs/${id}`);
      const blogData = response.data;
      setBlog(blogData);
      console.log(blogData.user);
      
      const userResponse = await https.get(`/users/${blogData.user}`);
      setUser(userResponse.data);
      hiddenSpinner();
    } catch (err) {
      hiddenSpinner();
      console.log(err);
    }
  }
  useEffect(() => {
    fetchBlogDetail ();
}, [id]);


  return (
    <div className=''>
      <h1 className='text-2xl p-10 font-semibold text-center'>{blog?.title}</h1>
      <div className="flex justify-center items-start">
      <div className="w-3/4">
      <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog?.content || '') }}></p>
      <div className="flex justify-end">
        <p>--{user?.name}Cre:Hoàng Anh--</p>
      </div>
      </div>
      </div>
    </div>
  )
}

export default DetailBlog